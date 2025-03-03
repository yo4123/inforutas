PGDMP  +                     }            delivery_routes_db    17.2    17.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                        0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16388    delivery_routes_db    DATABASE     �   CREATE DATABASE delivery_routes_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Panama.1252';
 "   DROP DATABASE delivery_routes_db;
                     postgres    false            �            1259    16394    delivery_routes    TABLE     �   CREATE TABLE public.delivery_routes (
    id integer NOT NULL,
    driver_id integer,
    scheduled_date timestamp without time zone NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 #   DROP TABLE public.delivery_routes;
       public         heap r       postgres    false            �            1259    16389    drivers    TABLE     c   CREATE TABLE public.drivers (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.drivers;
       public         heap r       postgres    false            �            1259    16407    orders    TABLE     �   CREATE TABLE public.orders (
    id integer NOT NULL,
    route_id integer,
    sequence integer NOT NULL,
    value numeric(10,2) NOT NULL,
    is_priority boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.orders;
       public         heap r       postgres    false            �          0    16394    delivery_routes 
   TABLE DATA           [   COPY public.delivery_routes (id, driver_id, scheduled_date, notes, created_at) FROM stdin;
    public               postgres    false    218   X       �          0    16389    drivers 
   TABLE DATA           +   COPY public.drivers (id, name) FROM stdin;
    public               postgres    false    217   �       �          0    16407    orders 
   TABLE DATA           X   COPY public.orders (id, route_id, sequence, value, is_priority, created_at) FROM stdin;
    public               postgres    false    219   F       d           2606    16401 $   delivery_routes delivery_routes_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.delivery_routes
    ADD CONSTRAINT delivery_routes_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.delivery_routes DROP CONSTRAINT delivery_routes_pkey;
       public                 postgres    false    218            b           2606    16393    drivers drivers_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.drivers DROP CONSTRAINT drivers_pkey;
       public                 postgres    false    217            f           2606    16413    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 postgres    false    219            g           2606    16402 .   delivery_routes delivery_routes_driver_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.delivery_routes
    ADD CONSTRAINT delivery_routes_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);
 X   ALTER TABLE ONLY public.delivery_routes DROP CONSTRAINT delivery_routes_driver_id_fkey;
       public               postgres    false    4706    218    217            h           2606    16414    orders orders_route_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.delivery_routes(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_route_id_fkey;
       public               postgres    false    218    219    4708            �   ;   x���	  �w;�T�hD:���!
�:�ImK���n@}�R��%�,��%?��/^
�      �   �   x��;�0���9�O��ّE�T�
1�U�"���q8G/�a�?ٲk��d`l�)p���K�(K�F���c�O�L��"���2�q����]j���%���S��竗'c�ZCC)D=����UF�k�Z���ٚ�5�|F�+�      �   q   x��ϻ�0К����_x���(	��VE6w��)!5x�x:��5.|��� �pצ?����N2'Q����N1R�Z(fw��$K���?	��-�d�g=��[k%DBT     