declare global {
  interface AlimentaryProduct {
    id: string;
    name?: string;
    name_fr?: string;
    store_area_id?: string;
    guide_price?: number
    image_url?: string;
  }
  interface SelectedAlimentaryProduct {
    details: AlimentaryProduct;
    quantity?: number;
    unit?: string;
  }
  interface StoreArea {
    id: string;
    name?: string;
    name_fr?: string;
  }
  interface KitchenEquipment {
    id: string;
    name?: string;
    name_fr?: string;
    image_url?: string;
  }
  interface Recipe {
    name: string;
    description: string;
    cookingTime: number;
    content: string;
    selectedAlimentaryProducts: SelectedAlimentaryProduct[];
    selectedKitchenEquipments: KitchenEquipment[]
  }
  interface fetchRecipe {
    id: string;
    name: string;
    description: string;
    cooking_time: number;
    content: string;
    is_public: string;
    author: {
      id: '89507049-fecb-4abe-baff-fe7ebebb9e51';
      username: 'max13h'
    }
  }
  interface RecipesAlimentaryProducts {
    recipe_id: string;
    alimentary_product_id: string;
    quantity?: number;
    unit?: string;
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
