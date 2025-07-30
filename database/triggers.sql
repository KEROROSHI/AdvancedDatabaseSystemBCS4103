
ALTER TABLE olist_products ADD COLUMN stock INTEGER DEFAULT 100;

CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$ BEGIN
    UPDATE olist_products
    SET stock = stock - 1
    WHERE product_id = NEW.product_id;

    IF (SELECT stock FROM olist_products WHERE product_id = NEW.product_id) < 0 THEN
        RAISE EXCEPTION 'Inventory below zero!';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_inventory
AFTER INSERT ON olist_order_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_order();
