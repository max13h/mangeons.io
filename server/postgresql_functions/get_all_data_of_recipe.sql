create
or replace function get_all_data_of_recipe (recipe_id uuid) returns table (
  id uuid,
  name text,
  author jsonb,
  is_public boolean,
  description text,
  content text,
  cooking_time smallint,
  alimentary_products jsonb[],
  kitchen_equipments jsonb[]
) as $$
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
$$ language plpgsql;
