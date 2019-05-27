create table if not exists shops (
       shop_id             SMALLINT,
       shop_name           VARCHAR(63),
       shop_address        VARCHAR(255) NOT NULL,
       shop_contact_number VARCHAR(15),
       contact_person_1    SMALLINT,
       discount            TINYINT DEFAULT 0,
       
       PRIMARY KEY (shop_id)
);


create table if not exists contact_persons (
       person_id           SMALLINT,
       person_name         VARCHAR(63),
       person_phone        VARCHAR(15),
       shop                SMALLINT,

       PRIMARY KEY (person_id),
       FOREIGN KEY (shop) REFERENCES shops(shop_id)
);

create table if not exists invoices (
       invoice_id          INT,
       shop                SMALLINT,
       order_date          DATE,
       total               INT,
       
       PRIMARY KEY (invoice_id),
       FOREIGN KEY (shop) REFERENCES shops(shop_id)
);

create table if not exists products (
       product_id          INT,
       product_name        VARCHAR(63) NOT NULL,
       price_unit_kg       SMALLINT NOT NULL,
       price_unit_box      SMALLINT,

       PRIMARY KEY (product_id)
);

create table if not exists line_item (
       line_item_id        INT,
       invoice             INT,
       product             INT,
       quantity            TINYINT
);
