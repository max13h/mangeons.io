
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_all_data_of_recipe"("recipe_id" "uuid") RETURNS TABLE("id" "uuid", "name" "text", "author" "jsonb", "is_public" boolean, "description" "text", "content" "text", "cooking_time" smallint, "image_url" "text", "meal_category_id" "uuid", "alimentary_products" "jsonb"[], "kitchen_equipments" "jsonb"[])
    LANGUAGE "plpgsql"
    AS $$
begin
  return query
  select
    r.id,
    r.name,
    jsonb_build_object(
      'id', u.id,
      'username', u.username
    ) as author,
    r.is_public,
    r.description,
    r.content,
    r.cooking_time,
    r.image_url,
    r.meal_category_id,
    array(
      select
        jsonb_build_object(
          'details',
          jsonb_build_object(
            'id', ap.id,
            'image_url', ap.image_url,
            'name_fr', ap.name_fr
          ),
          'quantity', rap.quantity,
          'unit', rap.unit
        )
      from recipes_alimentary_products rap
      join alimentary_products ap on rap.alimentary_product_id = ap.id
      where rap.recipe_id = r.id
    ) as alimentary_products,
    array(
      select
        jsonb_build_object(
          'id', ke.id,
          'name_fr', ke.name_fr,
          'image_url', ke.image_url
        )
      from recipes_kitchen_equipments rke
      join kitchen_equipments ke on rke.kitchen_equipment_id = ke.id
      where rke.recipe_id = r.id
    ) as kitchen_equipments
  from recipes as r
  left join users u on r.author = u.id
  where r.id = recipe_id;
end;
$$;

ALTER FUNCTION "public"."get_all_data_of_recipe"("recipe_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_cooking_type"("recipe_object" "jsonb") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
  declare
    cooking_time_type text;
  begin
    cooking_time_type := pg_typeof(recipe_object->>'cookingTime')::text;
    return cooking_time_type;
  end;
$$;

ALTER FUNCTION "public"."get_cooking_type"("recipe_object" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_public_user_id"("auth_user_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  public_user_id uuid;
BEGIN
  SELECT id INTO public_user_id
  FROM users
  WHERE user_id = auth_user_id;

  RETURN public_user_id;
END;
$$;

ALTER FUNCTION "public"."get_public_user_id"("auth_user_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."post_all_data_of_new_recipe"("recipe_data" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
declare
  new_recipe_id uuid;
begin
  insert into recipes (name, description, cooking_time, content, author, meal_category_id)
    values (
      recipe_data->>'name', 
      recipe_data->>'description', 
      (recipe_data->>'cookingTime')::smallint, 
      recipe_data->>'content', 
      (recipe_data->>'author')::uuid,
      (recipe_data->>'category')::uuid
    )
    returning id into new_recipe_id;

  insert into recipes_alimentary_products (recipe_id, alimentary_product_id, quantity, unit)
    select
      new_recipe_id,
      (elem->'details'->>'id')::uuid,
      (elem->>'quantity')::smallint,
      elem->>'unit'
    from jsonb_array_elements(recipe_data->'selectedAlimentaryProducts') as elem;

  insert into recipes_kitchen_equipments (recipe_id, kitchen_equipment_id)
    select
      new_recipe_id,
      (elem->>'id')::uuid
    from jsonb_array_elements(recipe_data->'selectedKitchenEquipments') as elem;

  return new_recipe_id;
end;
$$;

ALTER FUNCTION "public"."post_all_data_of_new_recipe"("recipe_data" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."test"("recipe_object" "jsonb") RETURNS "uuid"[]
    LANGUAGE "plpgsql"
    AS $$
declare
  result_array uuid[];
begin
  SELECT ARRAY(
    SELECT (elem->'details'->>'id')::uuid
    FROM jsonb_array_elements(recipe_object->'selectedAlimentaryProducts') AS elem
  ) INTO result_array;
  
  return result_array;
end;
$$;

ALTER FUNCTION "public"."test"("recipe_object" "jsonb") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_all_data_of_recipe"("recipe_object" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
  begin
    update recipes
      set name = recipe_object->>'name',
          description = recipe_object->>'description',
          content = recipe_object->>'content',
          cooking_time = (recipe_object->>'cookingTime')::smallint
      where id = (recipe_object->>'id')::uuid;

    delete from recipes_kitchen_equipments
      where recipe_id = (recipe_object->>'id')::uuid
      and kitchen_equipment_id not in (
          select (elem->>'id')::uuid
          from jsonb_array_elements(recipe_object->'selectedKitchenEquipments') as elem
      );

    insert into recipes_kitchen_equipments (recipe_id, kitchen_equipment_id)
      select 
        (recipe_object->>'id')::uuid, 
        (elem->>'id')::uuid
      from jsonb_array_elements(recipe_object->'selectedKitchenEquipments') as elem
      where not exists (
        select 1
        from recipes_kitchen_equipments as rke
        where rke.recipe_id = (recipe_object->>'id')::uuid
        and rke.kitchen_equipment_id = (elem->>'id')::uuid
      );

      -- delete from recipes_alimentary_products
      --   where recipe_id = (recipe_object->>'id')::uuid
      --   and alimentary_product_id not in (
      --       select (elem->'details'->>'id')::uuid
      --       from jsonb_array_elements(recipe_object->'selectedAlimentaryProducts') as elem
      --   );
  end;
$$;

ALTER FUNCTION "public"."update_all_data_of_recipe"("recipe_object" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."alimentary_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "guide_price" real,
    "store_area_id" "uuid",
    "name_fr" "text" NOT NULL,
    "image_url" "text"
);

ALTER TABLE "public"."alimentary_products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."alimentary_products_shopping_lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "shopping_list_id" "uuid" NOT NULL,
    "alimentary_product_id" "uuid" NOT NULL
);

ALTER TABLE "public"."alimentary_products_shopping_lists" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."households" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."households" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."households_kitchen_equipments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "household_id" "uuid" NOT NULL,
    "kitchen_equipment_id" "uuid" NOT NULL
);

ALTER TABLE "public"."households_kitchen_equipments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."kitchen_equipments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "name_fr" "text",
    "image_url" "text" NOT NULL
);

ALTER TABLE "public"."kitchen_equipments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."meal_category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "name_fr" "text"
);

ALTER TABLE "public"."meal_category" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."menus" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_public" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."menus" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."none_alimentary_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "guide_price_per_kg" real,
    "store_area_id" "uuid"
);

ALTER TABLE "public"."none_alimentary_products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."none_alimentary_products_shopping_lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "none_alimentary_products_id" "uuid" NOT NULL,
    "shopping_list_id" "uuid" NOT NULL
);

ALTER TABLE "public"."none_alimentary_products_shopping_lists" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "author" "uuid",
    "is_public" boolean DEFAULT false NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "content" "text" DEFAULT ''::"text",
    "cooking_time" smallint,
    "image_url" "text",
    "meal_category_id" "uuid",
    CONSTRAINT "recipes_content_check" CHECK (("length"("content") > 100)),
    CONSTRAINT "recipes_description_check" CHECK (("length"("description") < 120)),
    CONSTRAINT "recipes_name_check" CHECK (("length"("name") < 80))
);

ALTER TABLE "public"."recipes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes_alimentary_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "alimentary_product_id" "uuid" NOT NULL,
    "quantity" smallint,
    "unit" "text"
);

ALTER TABLE "public"."recipes_alimentary_products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes_kitchen_equipments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "kitchen_equipment_id" "uuid" NOT NULL
);

ALTER TABLE "public"."recipes_kitchen_equipments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes_menus" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "menu_id" "uuid" NOT NULL,
    "recipe_id" "uuid" NOT NULL
);

ALTER TABLE "public"."recipes_menus" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."shopping_lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "household_id" "uuid" NOT NULL,
    "menu_id" "uuid",
    "is_related_to_a_menu" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."shopping_lists" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."store_areas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "name_fr" "text"
);

ALTER TABLE "public"."store_areas" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "age" smallint,
    "household_id" "uuid",
    "tutorial_completed" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."alimentary_products"
    ADD CONSTRAINT "alimentary_products_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."recipes_alimentary_products"
    ADD CONSTRAINT "alimentary_products_recipes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."alimentary_products_shopping_lists"
    ADD CONSTRAINT "alimentary_products_shopping_lists_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."alimentary_products"
    ADD CONSTRAINT "food_products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."households_kitchen_equipments"
    ADD CONSTRAINT "households_kitchen_appliances_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."households"
    ADD CONSTRAINT "households_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."households"
    ADD CONSTRAINT "households_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."kitchen_equipments"
    ADD CONSTRAINT "kitchen_appliances_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."kitchen_equipments"
    ADD CONSTRAINT "kitchen_equipments_image_url_key" UNIQUE ("image_url");

ALTER TABLE ONLY "public"."kitchen_equipments"
    ADD CONSTRAINT "kitchen_equipments_name_fr_key" UNIQUE ("name_fr");

ALTER TABLE ONLY "public"."meal_category"
    ADD CONSTRAINT "meal_category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."none_alimentary_products"
    ADD CONSTRAINT "none_alimentary_products_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."none_alimentary_products"
    ADD CONSTRAINT "none_alimentary_products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."none_alimentary_products_shopping_lists"
    ADD CONSTRAINT "none_alimentary_products_shopping_lists_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_image_url_key" UNIQUE ("image_url");

ALTER TABLE ONLY "public"."recipes_kitchen_equipments"
    ADD CONSTRAINT "recipes_kitchen_equipments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."recipes_menus"
    ADD CONSTRAINT "recipes_menus_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."shopping_lists"
    ADD CONSTRAINT "shopping_lists_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."store_areas"
    ADD CONSTRAINT "store_area_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."alimentary_products_shopping_lists"
    ADD CONSTRAINT "alimentary_products_shopping_lists_alimentary_product_id_fkey" FOREIGN KEY ("alimentary_product_id") REFERENCES "public"."alimentary_products"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."alimentary_products_shopping_lists"
    ADD CONSTRAINT "alimentary_products_shopping_lists_shopping_list_id_fkey" FOREIGN KEY ("shopping_list_id") REFERENCES "public"."shopping_lists"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."alimentary_products"
    ADD CONSTRAINT "alimentary_products_store_area_id_fkey" FOREIGN KEY ("store_area_id") REFERENCES "public"."store_areas"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."households_kitchen_equipments"
    ADD CONSTRAINT "households_kitchen_equipments_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."households_kitchen_equipments"
    ADD CONSTRAINT "households_kitchen_equipments_kitchen_equipment_id_fkey" FOREIGN KEY ("kitchen_equipment_id") REFERENCES "public"."kitchen_equipments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."households"
    ADD CONSTRAINT "households_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."none_alimentary_products_shopping_lists"
    ADD CONSTRAINT "none_alimentary_products_shopping_lists_none_alimentary_product" FOREIGN KEY ("none_alimentary_products_id") REFERENCES "public"."none_alimentary_products"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."none_alimentary_products_shopping_lists"
    ADD CONSTRAINT "none_alimentary_products_shopping_lists_shopping_list_id_fkey" FOREIGN KEY ("shopping_list_id") REFERENCES "public"."shopping_lists"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."none_alimentary_products"
    ADD CONSTRAINT "none_alimentary_products_store_area_id_fkey" FOREIGN KEY ("store_area_id") REFERENCES "public"."store_areas"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."recipes_alimentary_products"
    ADD CONSTRAINT "recipes_alimentary_products_alimentary_product_id_fkey" FOREIGN KEY ("alimentary_product_id") REFERENCES "public"."alimentary_products"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes_alimentary_products"
    ADD CONSTRAINT "recipes_alimentary_products_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_author_fkey" FOREIGN KEY ("author") REFERENCES "public"."users"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."recipes_kitchen_equipments"
    ADD CONSTRAINT "recipes_kitchen_equipments_kitchen_equipment_id_fkey" FOREIGN KEY ("kitchen_equipment_id") REFERENCES "public"."kitchen_equipments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes_kitchen_equipments"
    ADD CONSTRAINT "recipes_kitchen_equipments_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_meal_category_id_fkey" FOREIGN KEY ("meal_category_id") REFERENCES "public"."meal_category"("id");

ALTER TABLE ONLY "public"."recipes_menus"
    ADD CONSTRAINT "recipes_menus_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes_menus"
    ADD CONSTRAINT "recipes_menus_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_lists"
    ADD CONSTRAINT "shopping_lists_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shopping_lists"
    ADD CONSTRAINT "shopping_lists_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_household_id_fkey" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "Enable SELECT to authenticated if author = user" ON "public"."recipes" FOR SELECT TO "authenticated" USING (("author" = "public"."get_public_user_id"("auth"."uid"())));

CREATE POLICY "Enable SELECT to authenticated if recipe is_public" ON "public"."recipes" FOR SELECT TO "authenticated" USING (("is_public" = true));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."recipes_kitchen_equipments" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for users based on user_id" ON "public"."recipes" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for users based on user_id" ON "public"."recipes_alimentary_products" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."kitchen_equipments" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."menus" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."recipes_alimentary_products" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable read access for authenticated users" ON "public"."recipes_kitchen_equipments" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access to authenticated users" ON "public"."alimentary_products" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access to authenticated users" ON "public"."store_areas" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Eneble SELECT for all authenticated users" ON "public"."meal_category" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "TEST UPDATE" ON "public"."recipes" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);

CREATE POLICY "TEST UPDATE" ON "public"."recipes_kitchen_equipments" FOR INSERT TO "authenticated" WITH CHECK (true);

ALTER TABLE "public"."alimentary_products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."alimentary_products_shopping_lists" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "destroy test" ON "public"."recipes_kitchen_equipments" FOR DELETE TO "authenticated" USING (true);

ALTER TABLE "public"."households" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."households_kitchen_equipments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."kitchen_equipments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."meal_category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."menus" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."none_alimentary_products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."none_alimentary_products_shopping_lists" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."recipes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."recipes_alimentary_products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."recipes_kitchen_equipments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."recipes_menus" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."shopping_lists" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."store_areas" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_all_data_of_recipe"("recipe_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_data_of_recipe"("recipe_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_data_of_recipe"("recipe_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_cooking_type"("recipe_object" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."get_cooking_type"("recipe_object" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_cooking_type"("recipe_object" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_public_user_id"("auth_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_public_user_id"("auth_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_public_user_id"("auth_user_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."post_all_data_of_new_recipe"("recipe_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."post_all_data_of_new_recipe"("recipe_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."post_all_data_of_new_recipe"("recipe_data" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."test"("recipe_object" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."test"("recipe_object" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."test"("recipe_object" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "public"."update_all_data_of_recipe"("recipe_object" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."update_all_data_of_recipe"("recipe_object" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_all_data_of_recipe"("recipe_object" "jsonb") TO "service_role";

GRANT ALL ON TABLE "public"."alimentary_products" TO "anon";
GRANT ALL ON TABLE "public"."alimentary_products" TO "authenticated";
GRANT ALL ON TABLE "public"."alimentary_products" TO "service_role";

GRANT ALL ON TABLE "public"."alimentary_products_shopping_lists" TO "anon";
GRANT ALL ON TABLE "public"."alimentary_products_shopping_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."alimentary_products_shopping_lists" TO "service_role";

GRANT ALL ON TABLE "public"."households" TO "anon";
GRANT ALL ON TABLE "public"."households" TO "authenticated";
GRANT ALL ON TABLE "public"."households" TO "service_role";

GRANT ALL ON TABLE "public"."households_kitchen_equipments" TO "anon";
GRANT ALL ON TABLE "public"."households_kitchen_equipments" TO "authenticated";
GRANT ALL ON TABLE "public"."households_kitchen_equipments" TO "service_role";

GRANT ALL ON TABLE "public"."kitchen_equipments" TO "anon";
GRANT ALL ON TABLE "public"."kitchen_equipments" TO "authenticated";
GRANT ALL ON TABLE "public"."kitchen_equipments" TO "service_role";

GRANT ALL ON TABLE "public"."meal_category" TO "anon";
GRANT ALL ON TABLE "public"."meal_category" TO "authenticated";
GRANT ALL ON TABLE "public"."meal_category" TO "service_role";

GRANT ALL ON TABLE "public"."menus" TO "anon";
GRANT ALL ON TABLE "public"."menus" TO "authenticated";
GRANT ALL ON TABLE "public"."menus" TO "service_role";

GRANT ALL ON TABLE "public"."none_alimentary_products" TO "anon";
GRANT ALL ON TABLE "public"."none_alimentary_products" TO "authenticated";
GRANT ALL ON TABLE "public"."none_alimentary_products" TO "service_role";

GRANT ALL ON TABLE "public"."none_alimentary_products_shopping_lists" TO "anon";
GRANT ALL ON TABLE "public"."none_alimentary_products_shopping_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."none_alimentary_products_shopping_lists" TO "service_role";

GRANT ALL ON TABLE "public"."recipes" TO "anon";
GRANT ALL ON TABLE "public"."recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes" TO "service_role";

GRANT ALL ON TABLE "public"."recipes_alimentary_products" TO "anon";
GRANT ALL ON TABLE "public"."recipes_alimentary_products" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes_alimentary_products" TO "service_role";

GRANT ALL ON TABLE "public"."recipes_kitchen_equipments" TO "anon";
GRANT ALL ON TABLE "public"."recipes_kitchen_equipments" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes_kitchen_equipments" TO "service_role";

GRANT ALL ON TABLE "public"."recipes_menus" TO "anon";
GRANT ALL ON TABLE "public"."recipes_menus" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes_menus" TO "service_role";

GRANT ALL ON TABLE "public"."shopping_lists" TO "anon";
GRANT ALL ON TABLE "public"."shopping_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_lists" TO "service_role";

GRANT ALL ON TABLE "public"."store_areas" TO "anon";
GRANT ALL ON TABLE "public"."store_areas" TO "authenticated";
GRANT ALL ON TABLE "public"."store_areas" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
