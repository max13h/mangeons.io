declare global {
  interface AlimentaryProduct {
    id: number;
    name?: string;
    name_fr?: string;
    store_area_id?: number;
    guide_price?: number
    image_url?: string;
  }
  interface SelectedAlimentaryProduct {
    details: AlimentaryProduct;
    quantity?: number;
    units?: string;
  }
  interface StoreArea {
    id: number;
    name?: string;
    name_fr?: string;
  }
  interface KitchenEquipment {
    id: string;
    name?: string;
    name_fr?: string;
    image_url?: string;
  }
  interface RecipesAlimentaryProducts {
    recipe_id: string;
    alimentary_product_id: string;
    quantity?: number;
    units?: string;
  }
  interface RecipesKitchenEquipments {
    recipe_id: string;
    kitchen_equipment_id: string;
  }

  interface NestedStepList {
    id: number;
    value: string;
    index: number
  }
  interface StepsList {
    id: number;
    value: string;
    nested: NestedStepList[];
    index: number,
  }

}

export {};
