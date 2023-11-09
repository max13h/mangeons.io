create
or replace function post_all_data_of_new_recipe (recipe_data jsonb) returns uuid as $$
declare
  new_recipe_id uuid;
begin
  insert into recipes (name, description, cooking_time, content, author)
    values (
      recipe_data->>'name',
      recipe_data->>'description',
      (recipe_data->>'cookingTime')::smallint,
      recipe_data->>'content',
      (recipe_data->>'author')::uuid
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
$$ language plpgsql;
