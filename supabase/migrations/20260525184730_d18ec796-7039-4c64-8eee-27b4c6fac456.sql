
-- 1. Remove tables from realtime publication to fix unauthorized channel subscription leaks
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;
ALTER PUBLICATION supabase_realtime DROP TABLE public.order_items;
ALTER PUBLICATION supabase_realtime DROP TABLE public.farmer_applications;

-- 2. Database-level financial integrity backstops
ALTER TABLE public.orders
  ADD CONSTRAINT orders_subtotal_nonneg CHECK (subtotal >= 0),
  ADD CONSTRAINT orders_delivery_nonneg CHECK (delivery_fee >= 0),
  ADD CONSTRAINT orders_total_positive CHECK (total > 0),
  ADD CONSTRAINT orders_total_matches CHECK (total = subtotal + delivery_fee),
  ADD CONSTRAINT orders_item_count_positive CHECK (item_count > 0);

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_unit_price_positive CHECK (unit_price > 0),
  ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  ADD CONSTRAINT order_items_line_total_matches CHECK (line_total = unit_price * quantity);

-- 3. Trigger: ensure order totals match the sum of their items
CREATE OR REPLACE FUNCTION public.validate_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  computed_subtotal numeric;
  computed_count integer;
  ord record;
BEGIN
  SELECT COALESCE(SUM(line_total), 0), COALESCE(SUM(quantity), 0)
    INTO computed_subtotal, computed_count
    FROM public.order_items WHERE order_id = NEW.order_id;

  SELECT subtotal, delivery_fee, total, item_count INTO ord
    FROM public.orders WHERE id = NEW.order_id;

  IF ord.subtotal <> computed_subtotal THEN
    RAISE EXCEPTION 'Order subtotal mismatch: expected %, got %', computed_subtotal, ord.subtotal;
  END IF;
  IF ord.total <> computed_subtotal + ord.delivery_fee THEN
    RAISE EXCEPTION 'Order total mismatch';
  END IF;
  IF ord.item_count <> computed_count THEN
    RAISE EXCEPTION 'Order item_count mismatch';
  END IF;
  RETURN NEW;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_validate_order_totals
  AFTER INSERT ON public.order_items
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_totals();
