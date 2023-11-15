type JsonPrimitive = null | number | string | boolean;
type Nested<V> = V | { [s: string]: V | Nested<V> } | Array<V | Nested<V>>;
type Json = Nested<JsonPrimitive>;

type ColumnValueCallbackContext = {
  /**
   * The seed of the field's model.
   *
   * \@example
   * ```ts
   * "<hash>/0/users/0"
   * ```
   */
  modelSeed: string;
  /**
   * The seed of the field.
   *
   * \@example
   * ```ts
   * "<hash>/0/users/0/email"
   * ```
   */
  seed: string;
};

/**
 * helper type to get the possible values of a scalar field
 */
type ColumnValue<T> = T | ((ctx: ColumnValueCallbackContext) => T);

/**
 * helper type to map a record of scalars to a record of ColumnValue
 */
type MapToColumnValue<T> = { [K in keyof T]: ColumnValue<T[K]> };

/**
 * Create an array of `n` models.
 *
 * Can be read as "Generate `model` times `n`".
 *
 * @param `n` The number of models to generate.
 * @param `callbackFn` The `x` function calls the `callbackFn` function one time for each element in the array.
 *
 * @example Generate 10 users:
 * ```ts
 * snaplet.users((x) => x(10));
 * ```
 *
 * @example Generate 3 projects with a specific name:
 * ```ts
 * snaplet.projects((x) => x(3, (index) => ({ name: `Project ${index}` })));
 * ```
 */
declare function xCallbackFn<T>(
  n: number | MinMaxOption,
  callbackFn?: (index: number) => T
): Array<T>;

type ChildCallbackInputs<T> = (
  x: typeof xCallbackFn<T>,
) => Array<T>;

/**
 * all the possible types for a child field
 */
type ChildInputs<T> = Array<T> | ChildCallbackInputs<T>;

/**
 * omit some keys TKeys from a child field
 * @example we remove ExecTask from the Snapshot child field values as we're coming from ExecTask
 * type ExecTaskChildrenInputs<TPath extends string[]> = {
 *   Snapshot: OmitChildInputs<SnapshotChildInputs<[...TPath, "Snapshot"]>, "ExecTask">;
 * };
 */
type OmitChildInputs<T, TKeys extends string> = T extends ChildCallbackInputs<
  infer U
>
  ? ChildCallbackInputs<Omit<U, TKeys>>
  : T extends Array<infer U>
  ? Array<Omit<U, TKeys>>
  : never;

type ConnectCallbackContext<TGraph, TPath extends string[]> = {
  /**
   * The branch of the current iteration for the relationship field.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#branch | documentation}.
   */
  branch: GetBranch<TGraph, TPath>;
  /**
   * The plan's graph.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#graph | documentation}.
   */
  graph: TGraph;
  /**
   * The index of the current iteration.
   */
  index: number;
  /**
   * The seed of the relationship field.
   */
  seed: string;
  /**
   * The plan's store.
   */
  store: Store;
};

/**
 * the callback function we can pass to a parent field to connect it to another model
 * @example
 * snaplet.Post({ User: (ctx) => ({ id: ctx.store.User[0] }) })
 */
type ConnectCallback<T, TGraph, TPath extends string[]> = (
  ctx: ConnectCallbackContext<TGraph, TPath>
) => T;

/**
 * compute the Graph type and the tracked path to pass to the connect callback
 */
type ParentCallbackInputs<T, TPath extends string[]> = TPath extends [
  infer TRoot,
  ...infer TRest extends string[],
]
  ? TRoot extends keyof Graph
    ? MergeGraphParts<Graph[TRoot]> extends infer TGraph
      ? ConnectCallback<T, TGraph, TRest>
      : never
    : never
  : never;

type ParentInputs<T, TPath extends string[]> =
  | T
  | ParentCallbackInputs<T, TPath>;

/**
 * omit some keys TKeys from a parent field
 * @example we remove Member from the Organization and User parent fields values as we're coming from Member
 * type MemberParentsInputs<TPath extends string[]> = {
 *   Organization: OmitParentInputs<OrganizationParentInputs<[...TPath, "Organization"]>, "Member", [...TPath, "Organization"]>;
 *   User: OmitParentInputs<UserParentInputs<[...TPath, "User"]>, "Member", [...TPath, "User"]>;
 * };
 */
type OmitParentInputs<
  T,
  TKeys extends string,
  TPath extends string[],
> = T extends ConnectCallback<infer U, any, any>
  ? ParentCallbackInputs<Omit<U, TKeys>, TPath>
  : Omit<T, TKeys>;

/**
 * compute the inputs type for a given model
 */
type Inputs<TScalars, TParents, TChildren> = Partial<
  MapToColumnValue<TScalars> & TParents & TChildren
>;

type OmitChildGraph<
  T extends Array<unknown>,
  TKeys extends string,
> = T extends Array<
  infer TGraph extends { Scalars: any; Parents: any; Children: any }
>
  ? Array<{
      Scalars: TGraph["Scalars"];
      Parents: TGraph["Parents"];
      Children: Omit<TGraph["Children"], TKeys>;
    }>
  : never;

type OmitParentGraph<
  T extends Array<unknown>,
  TKeys extends string,
> = T extends Array<
  infer TGraph extends { Scalars: any; Parents: any; Children: any }
>
  ? Array<{
      Scalars: TGraph["Scalars"];
      Parents: Omit<TGraph["Parents"], TKeys>;
      Children: TGraph["Children"];
    }>
  : never;

type UnwrapArray<T> = T extends Array<infer U> ? U : T;

type DeepUnwrapKeys<TGraph, TKeys extends any[]> = TKeys extends [
  infer THead,
  ...infer TTail,
]
  ? TTail extends any[]
    ? {
        [P in keyof TGraph]: P extends THead
          ? DeepUnwrapKeys<UnwrapArray<TGraph[P]>, TTail>
          : TGraph[P];
      }
    : TGraph
  : TGraph;

type GetBranch<T, K extends any[]> = T extends Array<infer U>
  ? DeepUnwrapKeys<U, K>
  : T;

type MergeGraphParts<T> = T extends Array<
  infer U extends { Scalars: unknown; Parents: unknown; Children: unknown }
>
  ? Array<
      U["Scalars"] & {
        [K in keyof U["Children"]]: MergeGraphParts<U["Children"][K]>;
      } & {
        [K in keyof U["Parents"]]: MergeGraphParts<
          U["Parents"][K]
        > extends Array<infer TParent>
          ? TParent
          : never;
      }
    >
  : never;

/**
 * the configurable map of models' generate and connect functions
 */
export type UserModels = {
  [KStore in keyof Store]?: Store[KStore] extends Array<
    infer TFields extends Record<string, any>
  >
    ? {
        connect?: (ctx: { store: Store }) => TFields;
        data?: Partial<MapToColumnValue<TFields>>;
      }
    : never;
};

type PlanOptions = {
  /**
   * Connect the missing relationships to one of the corresponding models in the store.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-autoconnect-option | documentation}.
   */
  autoConnect?: boolean;
  /**
   * Provide custom data generation and connect functions for this plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-autoconnect-option | documentation}.
   */
  models?: UserModels;
  /**
   * Pass a custom store instance to use for this plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#augmenting-external-data-with-createstore | documentation}.
   */
  store?: StoreInstance;
  /**
   * Use a custom seed for this plan.
   */
  seed?: string;
};

/**
 * the plan is extending PromiseLike so it can be awaited
 * @example
 * await snaplet.User({ name: "John" });
 */
export interface Plan extends PromiseLike<any> {
  generate: (initialStore?: Store) => Promise<Store>;
  /**
   * Compose multiple plans together, injecting the store of the previous plan into the next plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-pipe | documentation}.
   */
  pipe: Pipe;
  /**
   * Compose multiple plans together, without injecting the store of the previous plan into the next plan.
   * All stores stay independent and are merged together once all the plans are generated.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-merge | documentation}.
   */
  merge: Merge;
}

type Pipe = (plans: Plan[], options?: { models?: UserModels, seed?: string }) => Plan;

type Merge = (plans: Plan[], options?: { models?: UserModels, seed?: string }) => Plan;

type StoreInstance<T extends Partial<Store> = {}> = {
  _store: T;
  toSQL: () => string[];
};

type CreateStore = <T extends Partial<Store>>(
  initialData?: T,
  options?: { external: boolean },
) => StoreInstance<T>;
type Store = {
  _http_response: Array<_http_responseScalars>;
  alimentary_products: Array<alimentary_productsScalars>;
  alimentary_products_shopping_lists: Array<alimentary_products_shopping_listsScalars>;
  audit_log_entries: Array<audit_log_entriesScalars>;
  buckets: Array<bucketsScalars>;
  flow_state: Array<flow_stateScalars>;
  hooks: Array<hooksScalars>;
  households: Array<householdsScalars>;
  households_kitchen_equipments: Array<households_kitchen_equipmentsScalars>;
  http_request_queue: Array<http_request_queueScalars>;
  identities: Array<identitiesScalars>;
  instances: Array<instancesScalars>;
  key: Array<keyScalars>;
  kitchen_equipments: Array<kitchen_equipmentsScalars>;
  meal_category: Array<meal_categoryScalars>;
  menus: Array<menusScalars>;
  mfa_amr_claims: Array<mfa_amr_claimsScalars>;
  mfa_challenges: Array<mfa_challengesScalars>;
  mfa_factors: Array<mfa_factorsScalars>;
  storage_migrations: Array<storage_migrationsScalars>;
  supabase_functions_migrations: Array<supabase_functions_migrationsScalars>;
  none_alimentary_products: Array<none_alimentary_productsScalars>;
  none_alimentary_products_shopping_lists: Array<none_alimentary_products_shopping_listsScalars>;
  objects: Array<objectsScalars>;
  recipes: Array<recipesScalars>;
  recipes_alimentary_products: Array<recipes_alimentary_productsScalars>;
  recipes_kitchen_equipments: Array<recipes_kitchen_equipmentsScalars>;
  recipes_menus: Array<recipes_menusScalars>;
  refresh_tokens: Array<refresh_tokensScalars>;
  saml_providers: Array<saml_providersScalars>;
  saml_relay_states: Array<saml_relay_statesScalars>;
  auth_schema_migrations: Array<auth_schema_migrationsScalars>;
  supabase_migrations_schema_migrations: Array<supabase_migrations_schema_migrationsScalars>;
  secrets: Array<secretsScalars>;
  sessions: Array<sessionsScalars>;
  shopping_lists: Array<shopping_listsScalars>;
  sso_domains: Array<sso_domainsScalars>;
  sso_providers: Array<sso_providersScalars>;
  store_areas: Array<store_areasScalars>;
  auth_users: Array<auth_usersScalars>;
  public_users: Array<public_usersScalars>;
};
type aal_levelEnum = "aal1" | "aal2" | "aal3";
type code_challenge_methodEnum = "plain" | "s256";
type factor_statusEnum = "unverified" | "verified";
type factor_typeEnum = "totp" | "webauthn";
type request_statusEnum = "ERROR" | "PENDING" | "SUCCESS";
type key_statusEnum = "default" | "expired" | "invalid" | "valid";
type key_typeEnum = "aead-det" | "aead-ietf" | "auth" | "generichash" | "hmacsha256" | "hmacsha512" | "kdf" | "secretbox" | "secretstream" | "shorthash" | "stream_xchacha20";
type _http_responseScalars = {
  /**
   * Column `_http_response.id`.
   */
  id: number | null;
  /**
   * Column `_http_response.status_code`.
   */
  status_code: number | null;
  /**
   * Column `_http_response.content_type`.
   */
  content_type: string | null;
  /**
   * Column `_http_response.headers`.
   */
  headers: Json | null;
  /**
   * Column `_http_response.content`.
   */
  content: string | null;
  /**
   * Column `_http_response.timed_out`.
   */
  timed_out: boolean | null;
  /**
   * Column `_http_response.error_msg`.
   */
  error_msg: string | null;
  /**
   * Column `_http_response.created`.
   */
  created?: string;
}
type _http_responseParentsInputs<TPath extends string[]> = {

};
type _http_responseChildrenInputs<TPath extends string[]> = {

};
type _http_responseInputs<TPath extends string[]> = Inputs<
  _http_responseScalars,
  _http_responseParentsInputs<TPath>,
  _http_responseChildrenInputs<TPath>
>;
type _http_responseChildInputs<TPath extends string[]> = ChildInputs<_http_responseInputs<TPath>>;
type _http_responseParentInputs<TPath extends string[]> = ParentInputs<
_http_responseInputs<TPath>,
  TPath
>;
type alimentary_productsScalars = {
  /**
   * Column `alimentary_products.id`.
   */
  id?: string;
  /**
   * Column `alimentary_products.created_at`.
   */
  created_at?: string;
  /**
   * Column `alimentary_products.name`.
   */
  name: string;
  /**
   * Column `alimentary_products.guide_price`.
   */
  guide_price: number | null;
  /**
   * Column `alimentary_products.store_area_id`.
   */
  store_area_id: string | null;
  /**
   * Column `alimentary_products.name_fr`.
   */
  name_fr: string;
  /**
   * Column `alimentary_products.image_url`.
   */
  image_url: string | null;
}
type alimentary_productsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `alimentary_products` to table `store_areas` through the column `alimentary_products.store_area_id`.
   */
  store_areas: OmitParentInputs<store_areasParentInputs<[...TPath, "store_areas"]>, "alimentary_products", [...TPath, "store_areas"]>;
};
type alimentary_productsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `alimentary_products` to table `alimentary_products_shopping_lists` through the column `alimentary_products_shopping_lists.alimentary_product_id`.
  */
  alimentary_products_shopping_lists: OmitChildInputs<alimentary_products_shopping_listsChildInputs<[...TPath, "alimentary_products_shopping_lists"]>, "alimentary_products" | "alimentary_product_id">;
  /**
  * Relationship from table `alimentary_products` to table `recipes_alimentary_products` through the column `recipes_alimentary_products.alimentary_product_id`.
  */
  recipes_alimentary_products: OmitChildInputs<recipes_alimentary_productsChildInputs<[...TPath, "recipes_alimentary_products"]>, "alimentary_products" | "alimentary_product_id">;
};
type alimentary_productsInputs<TPath extends string[]> = Inputs<
  alimentary_productsScalars,
  alimentary_productsParentsInputs<TPath>,
  alimentary_productsChildrenInputs<TPath>
>;
type alimentary_productsChildInputs<TPath extends string[]> = ChildInputs<alimentary_productsInputs<TPath>>;
type alimentary_productsParentInputs<TPath extends string[]> = ParentInputs<
alimentary_productsInputs<TPath>,
  TPath
>;
type alimentary_products_shopping_listsScalars = {
  /**
   * Column `alimentary_products_shopping_lists.id`.
   */
  id?: string;
  /**
   * Column `alimentary_products_shopping_lists.shopping_list_id`.
   */
  shopping_list_id: string;
  /**
   * Column `alimentary_products_shopping_lists.alimentary_product_id`.
   */
  alimentary_product_id: string;
}
type alimentary_products_shopping_listsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `alimentary_products_shopping_lists` to table `alimentary_products` through the column `alimentary_products_shopping_lists.alimentary_product_id`.
   */
  alimentary_products: OmitParentInputs<alimentary_productsParentInputs<[...TPath, "alimentary_products"]>, "alimentary_products_shopping_lists", [...TPath, "alimentary_products"]>;
  /**
   * Relationship from table `alimentary_products_shopping_lists` to table `shopping_lists` through the column `alimentary_products_shopping_lists.shopping_list_id`.
   */
  shopping_lists: OmitParentInputs<shopping_listsParentInputs<[...TPath, "shopping_lists"]>, "alimentary_products_shopping_lists", [...TPath, "shopping_lists"]>;
};
type alimentary_products_shopping_listsChildrenInputs<TPath extends string[]> = {

};
type alimentary_products_shopping_listsInputs<TPath extends string[]> = Inputs<
  alimentary_products_shopping_listsScalars,
  alimentary_products_shopping_listsParentsInputs<TPath>,
  alimentary_products_shopping_listsChildrenInputs<TPath>
>;
type alimentary_products_shopping_listsChildInputs<TPath extends string[]> = ChildInputs<alimentary_products_shopping_listsInputs<TPath>>;
type alimentary_products_shopping_listsParentInputs<TPath extends string[]> = ParentInputs<
alimentary_products_shopping_listsInputs<TPath>,
  TPath
>;
type audit_log_entriesScalars = {
  /**
   * Column `audit_log_entries.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `audit_log_entries.id`.
   */
  id: string;
  /**
   * Column `audit_log_entries.payload`.
   */
  payload: Json | null;
  /**
   * Column `audit_log_entries.created_at`.
   */
  created_at: string | null;
  /**
   * Column `audit_log_entries.ip_address`.
   */
  ip_address?: string;
}
type audit_log_entriesParentsInputs<TPath extends string[]> = {

};
type audit_log_entriesChildrenInputs<TPath extends string[]> = {

};
type audit_log_entriesInputs<TPath extends string[]> = Inputs<
  audit_log_entriesScalars,
  audit_log_entriesParentsInputs<TPath>,
  audit_log_entriesChildrenInputs<TPath>
>;
type audit_log_entriesChildInputs<TPath extends string[]> = ChildInputs<audit_log_entriesInputs<TPath>>;
type audit_log_entriesParentInputs<TPath extends string[]> = ParentInputs<
audit_log_entriesInputs<TPath>,
  TPath
>;
type bucketsScalars = {
  /**
   * Column `buckets.id`.
   */
  id: string;
  /**
   * Column `buckets.name`.
   */
  name: string;
  /**
   * Column `buckets.owner`.
   */
  owner: string | null;
  /**
   * Column `buckets.created_at`.
   */
  created_at: string | null;
  /**
   * Column `buckets.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `buckets.public`.
   */
  public: boolean | null;
  /**
   * Column `buckets.avif_autodetection`.
   */
  avif_autodetection: boolean | null;
  /**
   * Column `buckets.file_size_limit`.
   */
  file_size_limit: number | null;
  /**
   * Column `buckets.allowed_mime_types`.
   */
  allowed_mime_types: string[] | null;
  /**
   * Column `buckets.owner_id`.
   */
  owner_id: string | null;
}
type bucketsParentsInputs<TPath extends string[]> = {

};
type bucketsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `buckets` to table `objects` through the column `objects.bucket_id`.
  */
  objects: OmitChildInputs<objectsChildInputs<[...TPath, "objects"]>, "buckets" | "bucket_id">;
};
type bucketsInputs<TPath extends string[]> = Inputs<
  bucketsScalars,
  bucketsParentsInputs<TPath>,
  bucketsChildrenInputs<TPath>
>;
type bucketsChildInputs<TPath extends string[]> = ChildInputs<bucketsInputs<TPath>>;
type bucketsParentInputs<TPath extends string[]> = ParentInputs<
bucketsInputs<TPath>,
  TPath
>;
type flow_stateScalars = {
  /**
   * Column `flow_state.id`.
   */
  id: string;
  /**
   * Column `flow_state.user_id`.
   */
  user_id: string | null;
  /**
   * Column `flow_state.auth_code`.
   */
  auth_code: string;
  /**
   * Column `flow_state.code_challenge_method`.
   */
  code_challenge_method: code_challenge_methodEnum;
  /**
   * Column `flow_state.code_challenge`.
   */
  code_challenge: string;
  /**
   * Column `flow_state.provider_type`.
   */
  provider_type: string;
  /**
   * Column `flow_state.provider_access_token`.
   */
  provider_access_token: string | null;
  /**
   * Column `flow_state.provider_refresh_token`.
   */
  provider_refresh_token: string | null;
  /**
   * Column `flow_state.created_at`.
   */
  created_at: string | null;
  /**
   * Column `flow_state.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `flow_state.authentication_method`.
   */
  authentication_method: string;
}
type flow_stateParentsInputs<TPath extends string[]> = {

};
type flow_stateChildrenInputs<TPath extends string[]> = {

};
type flow_stateInputs<TPath extends string[]> = Inputs<
  flow_stateScalars,
  flow_stateParentsInputs<TPath>,
  flow_stateChildrenInputs<TPath>
>;
type flow_stateChildInputs<TPath extends string[]> = ChildInputs<flow_stateInputs<TPath>>;
type flow_stateParentInputs<TPath extends string[]> = ParentInputs<
flow_stateInputs<TPath>,
  TPath
>;
type hooksScalars = {
  /**
   * Column `hooks.id`.
   */
  id?: number;
  /**
   * Column `hooks.hook_table_id`.
   */
  hook_table_id: number;
  /**
   * Column `hooks.hook_name`.
   */
  hook_name: string;
  /**
   * Column `hooks.created_at`.
   */
  created_at?: string;
  /**
   * Column `hooks.request_id`.
   */
  request_id: number | null;
}
type hooksParentsInputs<TPath extends string[]> = {

};
type hooksChildrenInputs<TPath extends string[]> = {

};
type hooksInputs<TPath extends string[]> = Inputs<
  hooksScalars,
  hooksParentsInputs<TPath>,
  hooksChildrenInputs<TPath>
>;
type hooksChildInputs<TPath extends string[]> = ChildInputs<hooksInputs<TPath>>;
type hooksParentInputs<TPath extends string[]> = ParentInputs<
hooksInputs<TPath>,
  TPath
>;
type householdsScalars = {
  /**
   * Column `households.id`.
   */
  id?: string;
  /**
   * Column `households.name`.
   */
  name: string;
  /**
   * Column `households.created_at`.
   */
  created_at?: string;
  /**
   * Column `households.user_id`.
   */
  user_id: string;
}
type householdsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `households` to table `users` through the column `households.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "households", [...TPath, "public_users"]>;
};
type householdsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `households` to table `households_kitchen_equipments` through the column `households_kitchen_equipments.household_id`.
  */
  households_kitchen_equipments: OmitChildInputs<households_kitchen_equipmentsChildInputs<[...TPath, "households_kitchen_equipments"]>, "households" | "household_id">;
  /**
  * Relationship from table `households` to table `shopping_lists` through the column `shopping_lists.household_id`.
  */
  shopping_lists: OmitChildInputs<shopping_listsChildInputs<[...TPath, "shopping_lists"]>, "households" | "household_id">;
};
type householdsInputs<TPath extends string[]> = Inputs<
  householdsScalars,
  householdsParentsInputs<TPath>,
  householdsChildrenInputs<TPath>
>;
type householdsChildInputs<TPath extends string[]> = ChildInputs<householdsInputs<TPath>>;
type householdsParentInputs<TPath extends string[]> = ParentInputs<
householdsInputs<TPath>,
  TPath
>;
type households_kitchen_equipmentsScalars = {
  /**
   * Column `households_kitchen_equipments.id`.
   */
  id?: string;
  /**
   * Column `households_kitchen_equipments.household_id`.
   */
  household_id: string;
  /**
   * Column `households_kitchen_equipments.kitchen_equipment_id`.
   */
  kitchen_equipment_id: string;
}
type households_kitchen_equipmentsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `households_kitchen_equipments` to table `households` through the column `households_kitchen_equipments.household_id`.
   */
  households: OmitParentInputs<householdsParentInputs<[...TPath, "households"]>, "households_kitchen_equipments", [...TPath, "households"]>;
  /**
   * Relationship from table `households_kitchen_equipments` to table `kitchen_equipments` through the column `households_kitchen_equipments.kitchen_equipment_id`.
   */
  kitchen_equipments: OmitParentInputs<kitchen_equipmentsParentInputs<[...TPath, "kitchen_equipments"]>, "households_kitchen_equipments", [...TPath, "kitchen_equipments"]>;
};
type households_kitchen_equipmentsChildrenInputs<TPath extends string[]> = {

};
type households_kitchen_equipmentsInputs<TPath extends string[]> = Inputs<
  households_kitchen_equipmentsScalars,
  households_kitchen_equipmentsParentsInputs<TPath>,
  households_kitchen_equipmentsChildrenInputs<TPath>
>;
type households_kitchen_equipmentsChildInputs<TPath extends string[]> = ChildInputs<households_kitchen_equipmentsInputs<TPath>>;
type households_kitchen_equipmentsParentInputs<TPath extends string[]> = ParentInputs<
households_kitchen_equipmentsInputs<TPath>,
  TPath
>;
type http_request_queueScalars = {
  /**
   * Column `http_request_queue.id`.
   */
  id?: number;
  /**
   * Column `http_request_queue.method`.
   */
  method: string;
  /**
   * Column `http_request_queue.url`.
   */
  url: string;
  /**
   * Column `http_request_queue.headers`.
   */
  headers: Json;
  /**
   * Column `http_request_queue.body`.
   */
  body: string | null;
  /**
   * Column `http_request_queue.timeout_milliseconds`.
   */
  timeout_milliseconds: number;
}
type http_request_queueParentsInputs<TPath extends string[]> = {

};
type http_request_queueChildrenInputs<TPath extends string[]> = {

};
type http_request_queueInputs<TPath extends string[]> = Inputs<
  http_request_queueScalars,
  http_request_queueParentsInputs<TPath>,
  http_request_queueChildrenInputs<TPath>
>;
type http_request_queueChildInputs<TPath extends string[]> = ChildInputs<http_request_queueInputs<TPath>>;
type http_request_queueParentInputs<TPath extends string[]> = ParentInputs<
http_request_queueInputs<TPath>,
  TPath
>;
type identitiesScalars = {
  /**
   * Column `identities.id`.
   */
  id: string;
  /**
   * Column `identities.user_id`.
   */
  user_id: string;
  /**
   * Column `identities.identity_data`.
   */
  identity_data: Json;
  /**
   * Column `identities.provider`.
   */
  provider: string;
  /**
   * Column `identities.last_sign_in_at`.
   */
  last_sign_in_at: string | null;
  /**
   * Column `identities.created_at`.
   */
  created_at: string | null;
  /**
   * Column `identities.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `identities.email`.
   */
  email?: string | null;
}
type identitiesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `identities` to table `users` through the column `identities.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "identities", [...TPath, "auth_users"]>;
};
type identitiesChildrenInputs<TPath extends string[]> = {

};
type identitiesInputs<TPath extends string[]> = Inputs<
  Omit<identitiesScalars, "email">,
  identitiesParentsInputs<TPath>,
  identitiesChildrenInputs<TPath>
>;
type identitiesChildInputs<TPath extends string[]> = ChildInputs<identitiesInputs<TPath>>;
type identitiesParentInputs<TPath extends string[]> = ParentInputs<
identitiesInputs<TPath>,
  TPath
>;
type instancesScalars = {
  /**
   * Column `instances.id`.
   */
  id: string;
  /**
   * Column `instances.uuid`.
   */
  uuid: string | null;
  /**
   * Column `instances.raw_base_config`.
   */
  raw_base_config: string | null;
  /**
   * Column `instances.created_at`.
   */
  created_at: string | null;
  /**
   * Column `instances.updated_at`.
   */
  updated_at: string | null;
}
type instancesParentsInputs<TPath extends string[]> = {

};
type instancesChildrenInputs<TPath extends string[]> = {

};
type instancesInputs<TPath extends string[]> = Inputs<
  instancesScalars,
  instancesParentsInputs<TPath>,
  instancesChildrenInputs<TPath>
>;
type instancesChildInputs<TPath extends string[]> = ChildInputs<instancesInputs<TPath>>;
type instancesParentInputs<TPath extends string[]> = ParentInputs<
instancesInputs<TPath>,
  TPath
>;
type keyScalars = {
  /**
   * Column `key.id`.
   */
  id?: string;
  /**
   * Column `key.status`.
   */
  status: key_statusEnum | null;
  /**
   * Column `key.created`.
   */
  created?: string;
  /**
   * Column `key.expires`.
   */
  expires: string | null;
  /**
   * Column `key.key_type`.
   */
  key_type: key_typeEnum | null;
  /**
   * Column `key.key_id`.
   */
  key_id: number | null;
  /**
   * Column `key.key_context`.
   */
  key_context: string | null;
  /**
   * Column `key.name`.
   */
  name: string | null;
  /**
   * Column `key.associated_data`.
   */
  associated_data: string | null;
  /**
   * Column `key.raw_key`.
   */
  raw_key: string | null;
  /**
   * Column `key.raw_key_nonce`.
   */
  raw_key_nonce: string | null;
  /**
   * Column `key.parent_key`.
   */
  parent_key: string | null;
  /**
   * Column `key.comment`.
   */
  comment: string | null;
  /**
   * Column `key.user_data`.
   */
  user_data: string | null;
}
type keyParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `key` to table `key` through the column `key.parent_key`.
   */
  key: OmitParentInputs<keyParentInputs<[...TPath, "key"]>, "key", [...TPath, "key"]>;
};
type keyChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `key` to table `secrets` through the column `secrets.key_id`.
  */
  secrets: OmitChildInputs<secretsChildInputs<[...TPath, "secrets"]>, "key" | "key_id">;
};
type keyInputs<TPath extends string[]> = Inputs<
  keyScalars,
  keyParentsInputs<TPath>,
  keyChildrenInputs<TPath>
>;
type keyChildInputs<TPath extends string[]> = ChildInputs<keyInputs<TPath>>;
type keyParentInputs<TPath extends string[]> = ParentInputs<
keyInputs<TPath>,
  TPath
>;
type kitchen_equipmentsScalars = {
  /**
   * Column `kitchen_equipments.id`.
   */
  id?: string;
  /**
   * Column `kitchen_equipments.created_at`.
   */
  created_at?: string;
  /**
   * Column `kitchen_equipments.name`.
   */
  name: string;
  /**
   * Column `kitchen_equipments.name_fr`.
   */
  name_fr: string | null;
  /**
   * Column `kitchen_equipments.image_url`.
   */
  image_url: string;
}
type kitchen_equipmentsParentsInputs<TPath extends string[]> = {

};
type kitchen_equipmentsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `kitchen_equipments` to table `households_kitchen_equipments` through the column `households_kitchen_equipments.kitchen_equipment_id`.
  */
  households_kitchen_equipments: OmitChildInputs<households_kitchen_equipmentsChildInputs<[...TPath, "households_kitchen_equipments"]>, "kitchen_equipments" | "kitchen_equipment_id">;
  /**
  * Relationship from table `kitchen_equipments` to table `recipes_kitchen_equipments` through the column `recipes_kitchen_equipments.kitchen_equipment_id`.
  */
  recipes_kitchen_equipments: OmitChildInputs<recipes_kitchen_equipmentsChildInputs<[...TPath, "recipes_kitchen_equipments"]>, "kitchen_equipments" | "kitchen_equipment_id">;
};
type kitchen_equipmentsInputs<TPath extends string[]> = Inputs<
  kitchen_equipmentsScalars,
  kitchen_equipmentsParentsInputs<TPath>,
  kitchen_equipmentsChildrenInputs<TPath>
>;
type kitchen_equipmentsChildInputs<TPath extends string[]> = ChildInputs<kitchen_equipmentsInputs<TPath>>;
type kitchen_equipmentsParentInputs<TPath extends string[]> = ParentInputs<
kitchen_equipmentsInputs<TPath>,
  TPath
>;
type meal_categoryScalars = {
  /**
   * Column `meal_category.id`.
   */
  id?: string;
  /**
   * Column `meal_category.name`.
   */
  name: string | null;
  /**
   * Column `meal_category.name_fr`.
   */
  name_fr: string | null;
}
type meal_categoryParentsInputs<TPath extends string[]> = {

};
type meal_categoryChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `meal_category` to table `recipes` through the column `recipes.meal_category_id`.
  */
  recipes: OmitChildInputs<recipesChildInputs<[...TPath, "recipes"]>, "meal_category" | "meal_category_id">;
};
type meal_categoryInputs<TPath extends string[]> = Inputs<
  meal_categoryScalars,
  meal_categoryParentsInputs<TPath>,
  meal_categoryChildrenInputs<TPath>
>;
type meal_categoryChildInputs<TPath extends string[]> = ChildInputs<meal_categoryInputs<TPath>>;
type meal_categoryParentInputs<TPath extends string[]> = ParentInputs<
meal_categoryInputs<TPath>,
  TPath
>;
type menusScalars = {
  /**
   * Column `menus.id`.
   */
  id?: string;
  /**
   * Column `menus.created_at`.
   */
  created_at?: string;
  /**
   * Column `menus.name`.
   */
  name: string;
  /**
   * Column `menus.user_id`.
   */
  user_id: string;
  /**
   * Column `menus.is_public`.
   */
  is_public?: boolean;
}
type menusParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `menus` to table `users` through the column `menus.user_id`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "menus", [...TPath, "public_users"]>;
};
type menusChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `menus` to table `recipes_menus` through the column `recipes_menus.menu_id`.
  */
  recipes_menus: OmitChildInputs<recipes_menusChildInputs<[...TPath, "recipes_menus"]>, "menus" | "menu_id">;
  /**
  * Relationship from table `menus` to table `shopping_lists` through the column `shopping_lists.menu_id`.
  */
  shopping_lists: OmitChildInputs<shopping_listsChildInputs<[...TPath, "shopping_lists"]>, "menus" | "menu_id">;
};
type menusInputs<TPath extends string[]> = Inputs<
  menusScalars,
  menusParentsInputs<TPath>,
  menusChildrenInputs<TPath>
>;
type menusChildInputs<TPath extends string[]> = ChildInputs<menusInputs<TPath>>;
type menusParentInputs<TPath extends string[]> = ParentInputs<
menusInputs<TPath>,
  TPath
>;
type mfa_amr_claimsScalars = {
  /**
   * Column `mfa_amr_claims.session_id`.
   */
  session_id: string;
  /**
   * Column `mfa_amr_claims.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_amr_claims.updated_at`.
   */
  updated_at: string;
  /**
   * Column `mfa_amr_claims.authentication_method`.
   */
  authentication_method: string;
  /**
   * Column `mfa_amr_claims.id`.
   */
  id: string;
}
type mfa_amr_claimsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_amr_claims` to table `sessions` through the column `mfa_amr_claims.session_id`.
   */
  sessions: OmitParentInputs<sessionsParentInputs<[...TPath, "sessions"]>, "mfa_amr_claims", [...TPath, "sessions"]>;
};
type mfa_amr_claimsChildrenInputs<TPath extends string[]> = {

};
type mfa_amr_claimsInputs<TPath extends string[]> = Inputs<
  mfa_amr_claimsScalars,
  mfa_amr_claimsParentsInputs<TPath>,
  mfa_amr_claimsChildrenInputs<TPath>
>;
type mfa_amr_claimsChildInputs<TPath extends string[]> = ChildInputs<mfa_amr_claimsInputs<TPath>>;
type mfa_amr_claimsParentInputs<TPath extends string[]> = ParentInputs<
mfa_amr_claimsInputs<TPath>,
  TPath
>;
type mfa_challengesScalars = {
  /**
   * Column `mfa_challenges.id`.
   */
  id: string;
  /**
   * Column `mfa_challenges.factor_id`.
   */
  factor_id: string;
  /**
   * Column `mfa_challenges.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_challenges.verified_at`.
   */
  verified_at: string | null;
  /**
   * Column `mfa_challenges.ip_address`.
   */
  ip_address: string;
}
type mfa_challengesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_challenges` to table `mfa_factors` through the column `mfa_challenges.factor_id`.
   */
  mfa_factors: OmitParentInputs<mfa_factorsParentInputs<[...TPath, "mfa_factors"]>, "mfa_challenges", [...TPath, "mfa_factors"]>;
};
type mfa_challengesChildrenInputs<TPath extends string[]> = {

};
type mfa_challengesInputs<TPath extends string[]> = Inputs<
  mfa_challengesScalars,
  mfa_challengesParentsInputs<TPath>,
  mfa_challengesChildrenInputs<TPath>
>;
type mfa_challengesChildInputs<TPath extends string[]> = ChildInputs<mfa_challengesInputs<TPath>>;
type mfa_challengesParentInputs<TPath extends string[]> = ParentInputs<
mfa_challengesInputs<TPath>,
  TPath
>;
type mfa_factorsScalars = {
  /**
   * Column `mfa_factors.id`.
   */
  id: string;
  /**
   * Column `mfa_factors.user_id`.
   */
  user_id: string;
  /**
   * Column `mfa_factors.friendly_name`.
   */
  friendly_name: string | null;
  /**
   * Column `mfa_factors.factor_type`.
   */
  factor_type: factor_typeEnum;
  /**
   * Column `mfa_factors.status`.
   */
  status: factor_statusEnum;
  /**
   * Column `mfa_factors.created_at`.
   */
  created_at: string;
  /**
   * Column `mfa_factors.updated_at`.
   */
  updated_at: string;
  /**
   * Column `mfa_factors.secret`.
   */
  secret: string | null;
}
type mfa_factorsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `mfa_factors` to table `users` through the column `mfa_factors.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "mfa_factors", [...TPath, "auth_users"]>;
};
type mfa_factorsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `mfa_factors` to table `mfa_challenges` through the column `mfa_challenges.factor_id`.
  */
  mfa_challenges: OmitChildInputs<mfa_challengesChildInputs<[...TPath, "mfa_challenges"]>, "mfa_factors" | "factor_id">;
};
type mfa_factorsInputs<TPath extends string[]> = Inputs<
  mfa_factorsScalars,
  mfa_factorsParentsInputs<TPath>,
  mfa_factorsChildrenInputs<TPath>
>;
type mfa_factorsChildInputs<TPath extends string[]> = ChildInputs<mfa_factorsInputs<TPath>>;
type mfa_factorsParentInputs<TPath extends string[]> = ParentInputs<
mfa_factorsInputs<TPath>,
  TPath
>;
type storage_migrationsScalars = {
  /**
   * Column `migrations.id`.
   */
  id: number;
  /**
   * Column `migrations.name`.
   */
  name: string;
  /**
   * Column `migrations.hash`.
   */
  hash: string;
  /**
   * Column `migrations.executed_at`.
   */
  executed_at: string | null;
}
type storage_migrationsParentsInputs<TPath extends string[]> = {

};
type storage_migrationsChildrenInputs<TPath extends string[]> = {

};
type storage_migrationsInputs<TPath extends string[]> = Inputs<
  storage_migrationsScalars,
  storage_migrationsParentsInputs<TPath>,
  storage_migrationsChildrenInputs<TPath>
>;
type storage_migrationsChildInputs<TPath extends string[]> = ChildInputs<storage_migrationsInputs<TPath>>;
type storage_migrationsParentInputs<TPath extends string[]> = ParentInputs<
storage_migrationsInputs<TPath>,
  TPath
>;
type supabase_functions_migrationsScalars = {
  /**
   * Column `migrations.version`.
   */
  version: string;
  /**
   * Column `migrations.inserted_at`.
   */
  inserted_at?: string;
}
type supabase_functions_migrationsParentsInputs<TPath extends string[]> = {

};
type supabase_functions_migrationsChildrenInputs<TPath extends string[]> = {

};
type supabase_functions_migrationsInputs<TPath extends string[]> = Inputs<
  supabase_functions_migrationsScalars,
  supabase_functions_migrationsParentsInputs<TPath>,
  supabase_functions_migrationsChildrenInputs<TPath>
>;
type supabase_functions_migrationsChildInputs<TPath extends string[]> = ChildInputs<supabase_functions_migrationsInputs<TPath>>;
type supabase_functions_migrationsParentInputs<TPath extends string[]> = ParentInputs<
supabase_functions_migrationsInputs<TPath>,
  TPath
>;
type none_alimentary_productsScalars = {
  /**
   * Column `none_alimentary_products.id`.
   */
  id?: string;
  /**
   * Column `none_alimentary_products.created_at`.
   */
  created_at?: string;
  /**
   * Column `none_alimentary_products.name`.
   */
  name: string;
  /**
   * Column `none_alimentary_products.guide_price_per_kg`.
   */
  guide_price_per_kg: number | null;
  /**
   * Column `none_alimentary_products.store_area_id`.
   */
  store_area_id: string | null;
}
type none_alimentary_productsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `none_alimentary_products` to table `store_areas` through the column `none_alimentary_products.store_area_id`.
   */
  store_areas: OmitParentInputs<store_areasParentInputs<[...TPath, "store_areas"]>, "none_alimentary_products", [...TPath, "store_areas"]>;
};
type none_alimentary_productsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `none_alimentary_products` to table `none_alimentary_products_shopping_lists` through the column `none_alimentary_products_shopping_lists.none_alimentary_products_id`.
  */
  none_alimentary_products_shopping_lists: OmitChildInputs<none_alimentary_products_shopping_listsChildInputs<[...TPath, "none_alimentary_products_shopping_lists"]>, "none_alimentary_products" | "none_alimentary_products_id">;
};
type none_alimentary_productsInputs<TPath extends string[]> = Inputs<
  none_alimentary_productsScalars,
  none_alimentary_productsParentsInputs<TPath>,
  none_alimentary_productsChildrenInputs<TPath>
>;
type none_alimentary_productsChildInputs<TPath extends string[]> = ChildInputs<none_alimentary_productsInputs<TPath>>;
type none_alimentary_productsParentInputs<TPath extends string[]> = ParentInputs<
none_alimentary_productsInputs<TPath>,
  TPath
>;
type none_alimentary_products_shopping_listsScalars = {
  /**
   * Column `none_alimentary_products_shopping_lists.id`.
   */
  id?: string;
  /**
   * Column `none_alimentary_products_shopping_lists.none_alimentary_products_id`.
   */
  none_alimentary_products_id: string;
  /**
   * Column `none_alimentary_products_shopping_lists.shopping_list_id`.
   */
  shopping_list_id: string;
}
type none_alimentary_products_shopping_listsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `none_alimentary_products_shopping_lists` to table `none_alimentary_products` through the column `none_alimentary_products_shopping_lists.none_alimentary_products_id`.
   */
  none_alimentary_products: OmitParentInputs<none_alimentary_productsParentInputs<[...TPath, "none_alimentary_products"]>, "none_alimentary_products_shopping_lists", [...TPath, "none_alimentary_products"]>;
  /**
   * Relationship from table `none_alimentary_products_shopping_lists` to table `shopping_lists` through the column `none_alimentary_products_shopping_lists.shopping_list_id`.
   */
  shopping_lists: OmitParentInputs<shopping_listsParentInputs<[...TPath, "shopping_lists"]>, "none_alimentary_products_shopping_lists", [...TPath, "shopping_lists"]>;
};
type none_alimentary_products_shopping_listsChildrenInputs<TPath extends string[]> = {

};
type none_alimentary_products_shopping_listsInputs<TPath extends string[]> = Inputs<
  none_alimentary_products_shopping_listsScalars,
  none_alimentary_products_shopping_listsParentsInputs<TPath>,
  none_alimentary_products_shopping_listsChildrenInputs<TPath>
>;
type none_alimentary_products_shopping_listsChildInputs<TPath extends string[]> = ChildInputs<none_alimentary_products_shopping_listsInputs<TPath>>;
type none_alimentary_products_shopping_listsParentInputs<TPath extends string[]> = ParentInputs<
none_alimentary_products_shopping_listsInputs<TPath>,
  TPath
>;
type objectsScalars = {
  /**
   * Column `objects.id`.
   */
  id?: string;
  /**
   * Column `objects.bucket_id`.
   */
  bucket_id: string | null;
  /**
   * Column `objects.name`.
   */
  name: string | null;
  /**
   * Column `objects.owner`.
   */
  owner: string | null;
  /**
   * Column `objects.created_at`.
   */
  created_at: string | null;
  /**
   * Column `objects.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `objects.last_accessed_at`.
   */
  last_accessed_at: string | null;
  /**
   * Column `objects.metadata`.
   */
  metadata: Json | null;
  /**
   * Column `objects.path_tokens`.
   */
  path_tokens?: string[] | null;
  /**
   * Column `objects.version`.
   */
  version: string | null;
  /**
   * Column `objects.owner_id`.
   */
  owner_id: string | null;
}
type objectsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `objects` to table `buckets` through the column `objects.bucket_id`.
   */
  buckets: OmitParentInputs<bucketsParentInputs<[...TPath, "buckets"]>, "objects", [...TPath, "buckets"]>;
};
type objectsChildrenInputs<TPath extends string[]> = {

};
type objectsInputs<TPath extends string[]> = Inputs<
  Omit<objectsScalars, "path_tokens">,
  objectsParentsInputs<TPath>,
  objectsChildrenInputs<TPath>
>;
type objectsChildInputs<TPath extends string[]> = ChildInputs<objectsInputs<TPath>>;
type objectsParentInputs<TPath extends string[]> = ParentInputs<
objectsInputs<TPath>,
  TPath
>;
type recipesScalars = {
  /**
   * Column `recipes.id`.
   */
  id?: string;
  /**
   * Column `recipes.created_at`.
   */
  created_at?: string;
  /**
   * Column `recipes.name`.
   */
  name: string;
  /**
   * Column `recipes.author`.
   */
  author: string | null;
  /**
   * Column `recipes.is_public`.
   */
  is_public?: boolean;
  /**
   * Column `recipes.description`.
   */
  description?: string;
  /**
   * Column `recipes.content`.
   */
  content: string | null;
  /**
   * Column `recipes.cooking_time`.
   */
  cooking_time: number | null;
  /**
   * Column `recipes.image_url`.
   */
  image_url: string | null;
  /**
   * Column `recipes.meal_category_id`.
   */
  meal_category_id: string | null;
}
type recipesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `recipes` to table `meal_category` through the column `recipes.meal_category_id`.
   */
  meal_category: OmitParentInputs<meal_categoryParentInputs<[...TPath, "meal_category"]>, "recipes", [...TPath, "meal_category"]>;
  /**
   * Relationship from table `recipes` to table `users` through the column `recipes.author`.
   */
  public_users: OmitParentInputs<public_usersParentInputs<[...TPath, "public_users"]>, "recipes", [...TPath, "public_users"]>;
};
type recipesChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `recipes` to table `recipes_alimentary_products` through the column `recipes_alimentary_products.recipe_id`.
  */
  recipes_alimentary_products: OmitChildInputs<recipes_alimentary_productsChildInputs<[...TPath, "recipes_alimentary_products"]>, "recipes" | "recipe_id">;
  /**
  * Relationship from table `recipes` to table `recipes_kitchen_equipments` through the column `recipes_kitchen_equipments.recipe_id`.
  */
  recipes_kitchen_equipments: OmitChildInputs<recipes_kitchen_equipmentsChildInputs<[...TPath, "recipes_kitchen_equipments"]>, "recipes" | "recipe_id">;
  /**
  * Relationship from table `recipes` to table `recipes_menus` through the column `recipes_menus.recipe_id`.
  */
  recipes_menus: OmitChildInputs<recipes_menusChildInputs<[...TPath, "recipes_menus"]>, "recipes" | "recipe_id">;
};
type recipesInputs<TPath extends string[]> = Inputs<
  recipesScalars,
  recipesParentsInputs<TPath>,
  recipesChildrenInputs<TPath>
>;
type recipesChildInputs<TPath extends string[]> = ChildInputs<recipesInputs<TPath>>;
type recipesParentInputs<TPath extends string[]> = ParentInputs<
recipesInputs<TPath>,
  TPath
>;
type recipes_alimentary_productsScalars = {
  /**
   * Column `recipes_alimentary_products.id`.
   */
  id?: string;
  /**
   * Column `recipes_alimentary_products.created_at`.
   */
  created_at?: string;
  /**
   * Column `recipes_alimentary_products.recipe_id`.
   */
  recipe_id: string;
  /**
   * Column `recipes_alimentary_products.alimentary_product_id`.
   */
  alimentary_product_id: string;
  /**
   * Column `recipes_alimentary_products.quantity`.
   */
  quantity: number | null;
  /**
   * Column `recipes_alimentary_products.unit`.
   */
  unit: string | null;
}
type recipes_alimentary_productsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `recipes_alimentary_products` to table `alimentary_products` through the column `recipes_alimentary_products.alimentary_product_id`.
   */
  alimentary_products: OmitParentInputs<alimentary_productsParentInputs<[...TPath, "alimentary_products"]>, "recipes_alimentary_products", [...TPath, "alimentary_products"]>;
  /**
   * Relationship from table `recipes_alimentary_products` to table `recipes` through the column `recipes_alimentary_products.recipe_id`.
   */
  recipes: OmitParentInputs<recipesParentInputs<[...TPath, "recipes"]>, "recipes_alimentary_products", [...TPath, "recipes"]>;
};
type recipes_alimentary_productsChildrenInputs<TPath extends string[]> = {

};
type recipes_alimentary_productsInputs<TPath extends string[]> = Inputs<
  recipes_alimentary_productsScalars,
  recipes_alimentary_productsParentsInputs<TPath>,
  recipes_alimentary_productsChildrenInputs<TPath>
>;
type recipes_alimentary_productsChildInputs<TPath extends string[]> = ChildInputs<recipes_alimentary_productsInputs<TPath>>;
type recipes_alimentary_productsParentInputs<TPath extends string[]> = ParentInputs<
recipes_alimentary_productsInputs<TPath>,
  TPath
>;
type recipes_kitchen_equipmentsScalars = {
  /**
   * Column `recipes_kitchen_equipments.id`.
   */
  id?: string;
  /**
   * Column `recipes_kitchen_equipments.recipe_id`.
   */
  recipe_id: string;
  /**
   * Column `recipes_kitchen_equipments.kitchen_equipment_id`.
   */
  kitchen_equipment_id: string;
}
type recipes_kitchen_equipmentsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `recipes_kitchen_equipments` to table `kitchen_equipments` through the column `recipes_kitchen_equipments.kitchen_equipment_id`.
   */
  kitchen_equipments: OmitParentInputs<kitchen_equipmentsParentInputs<[...TPath, "kitchen_equipments"]>, "recipes_kitchen_equipments", [...TPath, "kitchen_equipments"]>;
  /**
   * Relationship from table `recipes_kitchen_equipments` to table `recipes` through the column `recipes_kitchen_equipments.recipe_id`.
   */
  recipes: OmitParentInputs<recipesParentInputs<[...TPath, "recipes"]>, "recipes_kitchen_equipments", [...TPath, "recipes"]>;
};
type recipes_kitchen_equipmentsChildrenInputs<TPath extends string[]> = {

};
type recipes_kitchen_equipmentsInputs<TPath extends string[]> = Inputs<
  recipes_kitchen_equipmentsScalars,
  recipes_kitchen_equipmentsParentsInputs<TPath>,
  recipes_kitchen_equipmentsChildrenInputs<TPath>
>;
type recipes_kitchen_equipmentsChildInputs<TPath extends string[]> = ChildInputs<recipes_kitchen_equipmentsInputs<TPath>>;
type recipes_kitchen_equipmentsParentInputs<TPath extends string[]> = ParentInputs<
recipes_kitchen_equipmentsInputs<TPath>,
  TPath
>;
type recipes_menusScalars = {
  /**
   * Column `recipes_menus.id`.
   */
  id?: string;
  /**
   * Column `recipes_menus.menu_id`.
   */
  menu_id: string;
  /**
   * Column `recipes_menus.recipe_id`.
   */
  recipe_id: string;
}
type recipes_menusParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `recipes_menus` to table `menus` through the column `recipes_menus.menu_id`.
   */
  menus: OmitParentInputs<menusParentInputs<[...TPath, "menus"]>, "recipes_menus", [...TPath, "menus"]>;
  /**
   * Relationship from table `recipes_menus` to table `recipes` through the column `recipes_menus.recipe_id`.
   */
  recipes: OmitParentInputs<recipesParentInputs<[...TPath, "recipes"]>, "recipes_menus", [...TPath, "recipes"]>;
};
type recipes_menusChildrenInputs<TPath extends string[]> = {

};
type recipes_menusInputs<TPath extends string[]> = Inputs<
  recipes_menusScalars,
  recipes_menusParentsInputs<TPath>,
  recipes_menusChildrenInputs<TPath>
>;
type recipes_menusChildInputs<TPath extends string[]> = ChildInputs<recipes_menusInputs<TPath>>;
type recipes_menusParentInputs<TPath extends string[]> = ParentInputs<
recipes_menusInputs<TPath>,
  TPath
>;
type refresh_tokensScalars = {
  /**
   * Column `refresh_tokens.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `refresh_tokens.id`.
   */
  id?: number;
  /**
   * Column `refresh_tokens.token`.
   */
  token: string | null;
  /**
   * Column `refresh_tokens.user_id`.
   */
  user_id: string | null;
  /**
   * Column `refresh_tokens.revoked`.
   */
  revoked: boolean | null;
  /**
   * Column `refresh_tokens.created_at`.
   */
  created_at: string | null;
  /**
   * Column `refresh_tokens.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `refresh_tokens.parent`.
   */
  parent: string | null;
  /**
   * Column `refresh_tokens.session_id`.
   */
  session_id: string | null;
}
type refresh_tokensParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `refresh_tokens` to table `sessions` through the column `refresh_tokens.session_id`.
   */
  sessions: OmitParentInputs<sessionsParentInputs<[...TPath, "sessions"]>, "refresh_tokens", [...TPath, "sessions"]>;
};
type refresh_tokensChildrenInputs<TPath extends string[]> = {

};
type refresh_tokensInputs<TPath extends string[]> = Inputs<
  refresh_tokensScalars,
  refresh_tokensParentsInputs<TPath>,
  refresh_tokensChildrenInputs<TPath>
>;
type refresh_tokensChildInputs<TPath extends string[]> = ChildInputs<refresh_tokensInputs<TPath>>;
type refresh_tokensParentInputs<TPath extends string[]> = ParentInputs<
refresh_tokensInputs<TPath>,
  TPath
>;
type saml_providersScalars = {
  /**
   * Column `saml_providers.id`.
   */
  id: string;
  /**
   * Column `saml_providers.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `saml_providers.entity_id`.
   */
  entity_id: string;
  /**
   * Column `saml_providers.metadata_xml`.
   */
  metadata_xml: string;
  /**
   * Column `saml_providers.metadata_url`.
   */
  metadata_url: string | null;
  /**
   * Column `saml_providers.attribute_mapping`.
   */
  attribute_mapping: Json | null;
  /**
   * Column `saml_providers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `saml_providers.updated_at`.
   */
  updated_at: string | null;
}
type saml_providersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `saml_providers` to table `sso_providers` through the column `saml_providers.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "saml_providers", [...TPath, "sso_providers"]>;
};
type saml_providersChildrenInputs<TPath extends string[]> = {

};
type saml_providersInputs<TPath extends string[]> = Inputs<
  saml_providersScalars,
  saml_providersParentsInputs<TPath>,
  saml_providersChildrenInputs<TPath>
>;
type saml_providersChildInputs<TPath extends string[]> = ChildInputs<saml_providersInputs<TPath>>;
type saml_providersParentInputs<TPath extends string[]> = ParentInputs<
saml_providersInputs<TPath>,
  TPath
>;
type saml_relay_statesScalars = {
  /**
   * Column `saml_relay_states.id`.
   */
  id: string;
  /**
   * Column `saml_relay_states.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `saml_relay_states.request_id`.
   */
  request_id: string;
  /**
   * Column `saml_relay_states.for_email`.
   */
  for_email: string | null;
  /**
   * Column `saml_relay_states.redirect_to`.
   */
  redirect_to: string | null;
  /**
   * Column `saml_relay_states.from_ip_address`.
   */
  from_ip_address: string | null;
  /**
   * Column `saml_relay_states.created_at`.
   */
  created_at: string | null;
  /**
   * Column `saml_relay_states.updated_at`.
   */
  updated_at: string | null;
}
type saml_relay_statesParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `saml_relay_states` to table `sso_providers` through the column `saml_relay_states.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "saml_relay_states", [...TPath, "sso_providers"]>;
};
type saml_relay_statesChildrenInputs<TPath extends string[]> = {

};
type saml_relay_statesInputs<TPath extends string[]> = Inputs<
  saml_relay_statesScalars,
  saml_relay_statesParentsInputs<TPath>,
  saml_relay_statesChildrenInputs<TPath>
>;
type saml_relay_statesChildInputs<TPath extends string[]> = ChildInputs<saml_relay_statesInputs<TPath>>;
type saml_relay_statesParentInputs<TPath extends string[]> = ParentInputs<
saml_relay_statesInputs<TPath>,
  TPath
>;
type auth_schema_migrationsScalars = {
  /**
   * Column `schema_migrations.version`.
   */
  version: string;
}
type auth_schema_migrationsParentsInputs<TPath extends string[]> = {

};
type auth_schema_migrationsChildrenInputs<TPath extends string[]> = {

};
type auth_schema_migrationsInputs<TPath extends string[]> = Inputs<
  auth_schema_migrationsScalars,
  auth_schema_migrationsParentsInputs<TPath>,
  auth_schema_migrationsChildrenInputs<TPath>
>;
type auth_schema_migrationsChildInputs<TPath extends string[]> = ChildInputs<auth_schema_migrationsInputs<TPath>>;
type auth_schema_migrationsParentInputs<TPath extends string[]> = ParentInputs<
auth_schema_migrationsInputs<TPath>,
  TPath
>;
type supabase_migrations_schema_migrationsScalars = {
  /**
   * Column `schema_migrations.version`.
   */
  version: string;
  /**
   * Column `schema_migrations.statements`.
   */
  statements: string[] | null;
  /**
   * Column `schema_migrations.name`.
   */
  name: string | null;
}
type supabase_migrations_schema_migrationsParentsInputs<TPath extends string[]> = {

};
type supabase_migrations_schema_migrationsChildrenInputs<TPath extends string[]> = {

};
type supabase_migrations_schema_migrationsInputs<TPath extends string[]> = Inputs<
  supabase_migrations_schema_migrationsScalars,
  supabase_migrations_schema_migrationsParentsInputs<TPath>,
  supabase_migrations_schema_migrationsChildrenInputs<TPath>
>;
type supabase_migrations_schema_migrationsChildInputs<TPath extends string[]> = ChildInputs<supabase_migrations_schema_migrationsInputs<TPath>>;
type supabase_migrations_schema_migrationsParentInputs<TPath extends string[]> = ParentInputs<
supabase_migrations_schema_migrationsInputs<TPath>,
  TPath
>;
type secretsScalars = {
  /**
   * Column `secrets.id`.
   */
  id?: string;
  /**
   * Column `secrets.name`.
   */
  name: string | null;
  /**
   * Column `secrets.description`.
   */
  description?: string;
  /**
   * Column `secrets.secret`.
   */
  secret: string;
  /**
   * Column `secrets.key_id`.
   */
  key_id: string | null;
  /**
   * Column `secrets.nonce`.
   */
  nonce: string | null;
  /**
   * Column `secrets.created_at`.
   */
  created_at?: string;
  /**
   * Column `secrets.updated_at`.
   */
  updated_at?: string;
}
type secretsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `secrets` to table `key` through the column `secrets.key_id`.
   */
  key: OmitParentInputs<keyParentInputs<[...TPath, "key"]>, "secrets", [...TPath, "key"]>;
};
type secretsChildrenInputs<TPath extends string[]> = {

};
type secretsInputs<TPath extends string[]> = Inputs<
  secretsScalars,
  secretsParentsInputs<TPath>,
  secretsChildrenInputs<TPath>
>;
type secretsChildInputs<TPath extends string[]> = ChildInputs<secretsInputs<TPath>>;
type secretsParentInputs<TPath extends string[]> = ParentInputs<
secretsInputs<TPath>,
  TPath
>;
type sessionsScalars = {
  /**
   * Column `sessions.id`.
   */
  id: string;
  /**
   * Column `sessions.user_id`.
   */
  user_id: string;
  /**
   * Column `sessions.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sessions.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `sessions.factor_id`.
   */
  factor_id: string | null;
  /**
   * Column `sessions.aal`.
   */
  aal: aal_levelEnum | null;
  /**
   * Column `sessions.not_after`.
   */
  not_after: string | null;
}
type sessionsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `sessions` to table `users` through the column `sessions.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "sessions", [...TPath, "auth_users"]>;
};
type sessionsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `sessions` to table `mfa_amr_claims` through the column `mfa_amr_claims.session_id`.
  */
  mfa_amr_claims: OmitChildInputs<mfa_amr_claimsChildInputs<[...TPath, "mfa_amr_claims"]>, "sessions" | "session_id">;
  /**
  * Relationship from table `sessions` to table `refresh_tokens` through the column `refresh_tokens.session_id`.
  */
  refresh_tokens: OmitChildInputs<refresh_tokensChildInputs<[...TPath, "refresh_tokens"]>, "sessions" | "session_id">;
};
type sessionsInputs<TPath extends string[]> = Inputs<
  sessionsScalars,
  sessionsParentsInputs<TPath>,
  sessionsChildrenInputs<TPath>
>;
type sessionsChildInputs<TPath extends string[]> = ChildInputs<sessionsInputs<TPath>>;
type sessionsParentInputs<TPath extends string[]> = ParentInputs<
sessionsInputs<TPath>,
  TPath
>;
type shopping_listsScalars = {
  /**
   * Column `shopping_lists.id`.
   */
  id?: string;
  /**
   * Column `shopping_lists.created_at`.
   */
  created_at?: string;
  /**
   * Column `shopping_lists.household_id`.
   */
  household_id: string;
  /**
   * Column `shopping_lists.menu_id`.
   */
  menu_id: string | null;
  /**
   * Column `shopping_lists.is_related_to_a_menu`.
   */
  is_related_to_a_menu?: boolean;
}
type shopping_listsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `shopping_lists` to table `households` through the column `shopping_lists.household_id`.
   */
  households: OmitParentInputs<householdsParentInputs<[...TPath, "households"]>, "shopping_lists", [...TPath, "households"]>;
  /**
   * Relationship from table `shopping_lists` to table `menus` through the column `shopping_lists.menu_id`.
   */
  menus: OmitParentInputs<menusParentInputs<[...TPath, "menus"]>, "shopping_lists", [...TPath, "menus"]>;
};
type shopping_listsChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `shopping_lists` to table `alimentary_products_shopping_lists` through the column `alimentary_products_shopping_lists.shopping_list_id`.
  */
  alimentary_products_shopping_lists: OmitChildInputs<alimentary_products_shopping_listsChildInputs<[...TPath, "alimentary_products_shopping_lists"]>, "shopping_lists" | "shopping_list_id">;
  /**
  * Relationship from table `shopping_lists` to table `none_alimentary_products_shopping_lists` through the column `none_alimentary_products_shopping_lists.shopping_list_id`.
  */
  none_alimentary_products_shopping_lists: OmitChildInputs<none_alimentary_products_shopping_listsChildInputs<[...TPath, "none_alimentary_products_shopping_lists"]>, "shopping_lists" | "shopping_list_id">;
};
type shopping_listsInputs<TPath extends string[]> = Inputs<
  shopping_listsScalars,
  shopping_listsParentsInputs<TPath>,
  shopping_listsChildrenInputs<TPath>
>;
type shopping_listsChildInputs<TPath extends string[]> = ChildInputs<shopping_listsInputs<TPath>>;
type shopping_listsParentInputs<TPath extends string[]> = ParentInputs<
shopping_listsInputs<TPath>,
  TPath
>;
type sso_domainsScalars = {
  /**
   * Column `sso_domains.id`.
   */
  id: string;
  /**
   * Column `sso_domains.sso_provider_id`.
   */
  sso_provider_id: string;
  /**
   * Column `sso_domains.domain`.
   */
  domain: string;
  /**
   * Column `sso_domains.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sso_domains.updated_at`.
   */
  updated_at: string | null;
}
type sso_domainsParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `sso_domains` to table `sso_providers` through the column `sso_domains.sso_provider_id`.
   */
  sso_providers: OmitParentInputs<sso_providersParentInputs<[...TPath, "sso_providers"]>, "sso_domains", [...TPath, "sso_providers"]>;
};
type sso_domainsChildrenInputs<TPath extends string[]> = {

};
type sso_domainsInputs<TPath extends string[]> = Inputs<
  sso_domainsScalars,
  sso_domainsParentsInputs<TPath>,
  sso_domainsChildrenInputs<TPath>
>;
type sso_domainsChildInputs<TPath extends string[]> = ChildInputs<sso_domainsInputs<TPath>>;
type sso_domainsParentInputs<TPath extends string[]> = ParentInputs<
sso_domainsInputs<TPath>,
  TPath
>;
type sso_providersScalars = {
  /**
   * Column `sso_providers.id`.
   */
  id: string;
  /**
   * Column `sso_providers.resource_id`.
   */
  resource_id: string | null;
  /**
   * Column `sso_providers.created_at`.
   */
  created_at: string | null;
  /**
   * Column `sso_providers.updated_at`.
   */
  updated_at: string | null;
}
type sso_providersParentsInputs<TPath extends string[]> = {

};
type sso_providersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `sso_providers` to table `saml_providers` through the column `saml_providers.sso_provider_id`.
  */
  saml_providers: OmitChildInputs<saml_providersChildInputs<[...TPath, "saml_providers"]>, "sso_providers" | "sso_provider_id">;
  /**
  * Relationship from table `sso_providers` to table `saml_relay_states` through the column `saml_relay_states.sso_provider_id`.
  */
  saml_relay_states: OmitChildInputs<saml_relay_statesChildInputs<[...TPath, "saml_relay_states"]>, "sso_providers" | "sso_provider_id">;
  /**
  * Relationship from table `sso_providers` to table `sso_domains` through the column `sso_domains.sso_provider_id`.
  */
  sso_domains: OmitChildInputs<sso_domainsChildInputs<[...TPath, "sso_domains"]>, "sso_providers" | "sso_provider_id">;
};
type sso_providersInputs<TPath extends string[]> = Inputs<
  sso_providersScalars,
  sso_providersParentsInputs<TPath>,
  sso_providersChildrenInputs<TPath>
>;
type sso_providersChildInputs<TPath extends string[]> = ChildInputs<sso_providersInputs<TPath>>;
type sso_providersParentInputs<TPath extends string[]> = ParentInputs<
sso_providersInputs<TPath>,
  TPath
>;
type store_areasScalars = {
  /**
   * Column `store_areas.id`.
   */
  id?: string;
  /**
   * Column `store_areas.name`.
   */
  name: string;
  /**
   * Column `store_areas.name_fr`.
   */
  name_fr: string | null;
}
type store_areasParentsInputs<TPath extends string[]> = {

};
type store_areasChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `store_areas` to table `alimentary_products` through the column `alimentary_products.store_area_id`.
  */
  alimentary_products: OmitChildInputs<alimentary_productsChildInputs<[...TPath, "alimentary_products"]>, "store_areas" | "store_area_id">;
  /**
  * Relationship from table `store_areas` to table `none_alimentary_products` through the column `none_alimentary_products.store_area_id`.
  */
  none_alimentary_products: OmitChildInputs<none_alimentary_productsChildInputs<[...TPath, "none_alimentary_products"]>, "store_areas" | "store_area_id">;
};
type store_areasInputs<TPath extends string[]> = Inputs<
  store_areasScalars,
  store_areasParentsInputs<TPath>,
  store_areasChildrenInputs<TPath>
>;
type store_areasChildInputs<TPath extends string[]> = ChildInputs<store_areasInputs<TPath>>;
type store_areasParentInputs<TPath extends string[]> = ParentInputs<
store_areasInputs<TPath>,
  TPath
>;
type auth_usersScalars = {
  /**
   * Column `users.instance_id`.
   */
  instance_id: string | null;
  /**
   * Column `users.id`.
   */
  id: string;
  /**
   * Column `users.aud`.
   */
  aud: string | null;
  /**
   * Column `users.role`.
   */
  role: string | null;
  /**
   * Column `users.email`.
   */
  email: string | null;
  /**
   * Column `users.encrypted_password`.
   */
  encrypted_password: string | null;
  /**
   * Column `users.email_confirmed_at`.
   */
  email_confirmed_at: string | null;
  /**
   * Column `users.invited_at`.
   */
  invited_at: string | null;
  /**
   * Column `users.confirmation_token`.
   */
  confirmation_token: string | null;
  /**
   * Column `users.confirmation_sent_at`.
   */
  confirmation_sent_at: string | null;
  /**
   * Column `users.recovery_token`.
   */
  recovery_token: string | null;
  /**
   * Column `users.recovery_sent_at`.
   */
  recovery_sent_at: string | null;
  /**
   * Column `users.email_change_token_new`.
   */
  email_change_token_new: string | null;
  /**
   * Column `users.email_change`.
   */
  email_change: string | null;
  /**
   * Column `users.email_change_sent_at`.
   */
  email_change_sent_at: string | null;
  /**
   * Column `users.last_sign_in_at`.
   */
  last_sign_in_at: string | null;
  /**
   * Column `users.raw_app_meta_data`.
   */
  raw_app_meta_data: Json | null;
  /**
   * Column `users.raw_user_meta_data`.
   */
  raw_user_meta_data: Json | null;
  /**
   * Column `users.is_super_admin`.
   */
  is_super_admin: boolean | null;
  /**
   * Column `users.created_at`.
   */
  created_at: string | null;
  /**
   * Column `users.updated_at`.
   */
  updated_at: string | null;
  /**
   * Column `users.phone`.
   */
  phone: string | null;
  /**
   * Column `users.phone_confirmed_at`.
   */
  phone_confirmed_at: string | null;
  /**
   * Column `users.phone_change`.
   */
  phone_change: string | null;
  /**
   * Column `users.phone_change_token`.
   */
  phone_change_token: string | null;
  /**
   * Column `users.phone_change_sent_at`.
   */
  phone_change_sent_at: string | null;
  /**
   * Column `users.confirmed_at`.
   */
  confirmed_at?: string | null;
  /**
   * Column `users.email_change_token_current`.
   */
  email_change_token_current: string | null;
  /**
   * Column `users.email_change_confirm_status`.
   */
  email_change_confirm_status: number | null;
  /**
   * Column `users.banned_until`.
   */
  banned_until: string | null;
  /**
   * Column `users.reauthentication_token`.
   */
  reauthentication_token: string | null;
  /**
   * Column `users.reauthentication_sent_at`.
   */
  reauthentication_sent_at: string | null;
  /**
   * Column `users.is_sso_user`.
   */
  is_sso_user?: boolean;
  /**
   * Column `users.deleted_at`.
   */
  deleted_at: string | null;
}
type auth_usersParentsInputs<TPath extends string[]> = {

};
type auth_usersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `users` to table `identities` through the column `identities.user_id`.
  */
  identities: OmitChildInputs<identitiesChildInputs<[...TPath, "identities"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `mfa_factors` through the column `mfa_factors.user_id`.
  */
  mfa_factors: OmitChildInputs<mfa_factorsChildInputs<[...TPath, "mfa_factors"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `sessions` through the column `sessions.user_id`.
  */
  sessions: OmitChildInputs<sessionsChildInputs<[...TPath, "sessions"]>, "auth_users" | "user_id">;
  /**
  * Relationship from table `users` to table `users` through the column `users.user_id`.
  */
  public_users: OmitChildInputs<public_usersChildInputs<[...TPath, "public_users"]>, "auth_users" | "user_id">;
};
type auth_usersInputs<TPath extends string[]> = Inputs<
  Omit<auth_usersScalars, "confirmed_at">,
  auth_usersParentsInputs<TPath>,
  auth_usersChildrenInputs<TPath>
>;
type auth_usersChildInputs<TPath extends string[]> = ChildInputs<auth_usersInputs<TPath>>;
type auth_usersParentInputs<TPath extends string[]> = ParentInputs<
auth_usersInputs<TPath>,
  TPath
>;
type public_usersScalars = {
  /**
   * Column `users.id`.
   */
  id?: string;
  /**
   * Column `users.created_at`.
   */
  created_at?: string;
  /**
   * Column `users.user_id`.
   */
  user_id: string;
  /**
   * Column `users.username`.
   */
  username: string;
  /**
   * Column `users.first_name`.
   */
  first_name: string | null;
  /**
   * Column `users.last_name`.
   */
  last_name: string | null;
  /**
   * Column `users.age`.
   */
  age: number | null;
  /**
   * Column `users.household_id`.
   */
  household_id: string | null;
  /**
   * Column `users.tutorial_completed`.
   */
  tutorial_completed?: boolean;
}
type public_usersParentsInputs<TPath extends string[]> = {
  /**
   * Relationship from table `users` to table `users` through the column `users.user_id`.
   */
  auth_users: OmitParentInputs<auth_usersParentInputs<[...TPath, "auth_users"]>, "public_users", [...TPath, "auth_users"]>;
  /**
   * Relationship from table `users` to table `households` through the column `users.household_id`.
   */
  households: OmitParentInputs<householdsParentInputs<[...TPath, "households"]>, "public_users", [...TPath, "households"]>;
};
type public_usersChildrenInputs<TPath extends string[]> = {
  /**
  * Relationship from table `users` to table `menus` through the column `menus.user_id`.
  */
  menus: OmitChildInputs<menusChildInputs<[...TPath, "menus"]>, "public_users" | "user_id">;
  /**
  * Relationship from table `users` to table `recipes` through the column `recipes.author`.
  */
  recipes: OmitChildInputs<recipesChildInputs<[...TPath, "recipes"]>, "public_users" | "author">;
};
type public_usersInputs<TPath extends string[]> = Inputs<
  public_usersScalars,
  public_usersParentsInputs<TPath>,
  public_usersChildrenInputs<TPath>
>;
type public_usersChildInputs<TPath extends string[]> = ChildInputs<public_usersInputs<TPath>>;
type public_usersParentInputs<TPath extends string[]> = ParentInputs<
public_usersInputs<TPath>,
  TPath
>;
type _http_responseParentsGraph = {

};
type _http_responseChildrenGraph = {

};
type _http_responseGraph = Array<{
  Scalars: _http_responseScalars;
  Parents: _http_responseParentsGraph;
  Children: _http_responseChildrenGraph;
}>;
type alimentary_productsParentsGraph = {
 store_areas: OmitChildGraph<store_areasGraph, "alimentary_products">;
};
type alimentary_productsChildrenGraph = {
 alimentary_products_shopping_lists: OmitParentGraph<alimentary_products_shopping_listsGraph, "alimentary_products">;
 recipes_alimentary_products: OmitParentGraph<recipes_alimentary_productsGraph, "alimentary_products">;
};
type alimentary_productsGraph = Array<{
  Scalars: alimentary_productsScalars;
  Parents: alimentary_productsParentsGraph;
  Children: alimentary_productsChildrenGraph;
}>;
type alimentary_products_shopping_listsParentsGraph = {
 alimentary_products: OmitChildGraph<alimentary_productsGraph, "alimentary_products_shopping_lists">;
 shopping_lists: OmitChildGraph<shopping_listsGraph, "alimentary_products_shopping_lists">;
};
type alimentary_products_shopping_listsChildrenGraph = {

};
type alimentary_products_shopping_listsGraph = Array<{
  Scalars: alimentary_products_shopping_listsScalars;
  Parents: alimentary_products_shopping_listsParentsGraph;
  Children: alimentary_products_shopping_listsChildrenGraph;
}>;
type audit_log_entriesParentsGraph = {

};
type audit_log_entriesChildrenGraph = {

};
type audit_log_entriesGraph = Array<{
  Scalars: audit_log_entriesScalars;
  Parents: audit_log_entriesParentsGraph;
  Children: audit_log_entriesChildrenGraph;
}>;
type bucketsParentsGraph = {

};
type bucketsChildrenGraph = {
 objects: OmitParentGraph<objectsGraph, "buckets">;
};
type bucketsGraph = Array<{
  Scalars: bucketsScalars;
  Parents: bucketsParentsGraph;
  Children: bucketsChildrenGraph;
}>;
type flow_stateParentsGraph = {

};
type flow_stateChildrenGraph = {

};
type flow_stateGraph = Array<{
  Scalars: flow_stateScalars;
  Parents: flow_stateParentsGraph;
  Children: flow_stateChildrenGraph;
}>;
type hooksParentsGraph = {

};
type hooksChildrenGraph = {

};
type hooksGraph = Array<{
  Scalars: hooksScalars;
  Parents: hooksParentsGraph;
  Children: hooksChildrenGraph;
}>;
type householdsParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "households">;
};
type householdsChildrenGraph = {
 households_kitchen_equipments: OmitParentGraph<households_kitchen_equipmentsGraph, "households">;
 shopping_lists: OmitParentGraph<shopping_listsGraph, "households">;
};
type householdsGraph = Array<{
  Scalars: householdsScalars;
  Parents: householdsParentsGraph;
  Children: householdsChildrenGraph;
}>;
type households_kitchen_equipmentsParentsGraph = {
 households: OmitChildGraph<householdsGraph, "households_kitchen_equipments">;
 kitchen_equipments: OmitChildGraph<kitchen_equipmentsGraph, "households_kitchen_equipments">;
};
type households_kitchen_equipmentsChildrenGraph = {

};
type households_kitchen_equipmentsGraph = Array<{
  Scalars: households_kitchen_equipmentsScalars;
  Parents: households_kitchen_equipmentsParentsGraph;
  Children: households_kitchen_equipmentsChildrenGraph;
}>;
type http_request_queueParentsGraph = {

};
type http_request_queueChildrenGraph = {

};
type http_request_queueGraph = Array<{
  Scalars: http_request_queueScalars;
  Parents: http_request_queueParentsGraph;
  Children: http_request_queueChildrenGraph;
}>;
type identitiesParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "identities">;
};
type identitiesChildrenGraph = {

};
type identitiesGraph = Array<{
  Scalars: identitiesScalars;
  Parents: identitiesParentsGraph;
  Children: identitiesChildrenGraph;
}>;
type instancesParentsGraph = {

};
type instancesChildrenGraph = {

};
type instancesGraph = Array<{
  Scalars: instancesScalars;
  Parents: instancesParentsGraph;
  Children: instancesChildrenGraph;
}>;
type keyParentsGraph = {
 key: OmitChildGraph<keyGraph, "key">;
};
type keyChildrenGraph = {
 secrets: OmitParentGraph<secretsGraph, "key">;
};
type keyGraph = Array<{
  Scalars: keyScalars;
  Parents: keyParentsGraph;
  Children: keyChildrenGraph;
}>;
type kitchen_equipmentsParentsGraph = {

};
type kitchen_equipmentsChildrenGraph = {
 households_kitchen_equipments: OmitParentGraph<households_kitchen_equipmentsGraph, "kitchen_equipments">;
 recipes_kitchen_equipments: OmitParentGraph<recipes_kitchen_equipmentsGraph, "kitchen_equipments">;
};
type kitchen_equipmentsGraph = Array<{
  Scalars: kitchen_equipmentsScalars;
  Parents: kitchen_equipmentsParentsGraph;
  Children: kitchen_equipmentsChildrenGraph;
}>;
type meal_categoryParentsGraph = {

};
type meal_categoryChildrenGraph = {
 recipes: OmitParentGraph<recipesGraph, "meal_category">;
};
type meal_categoryGraph = Array<{
  Scalars: meal_categoryScalars;
  Parents: meal_categoryParentsGraph;
  Children: meal_categoryChildrenGraph;
}>;
type menusParentsGraph = {
 public_users: OmitChildGraph<public_usersGraph, "menus">;
};
type menusChildrenGraph = {
 recipes_menus: OmitParentGraph<recipes_menusGraph, "menus">;
 shopping_lists: OmitParentGraph<shopping_listsGraph, "menus">;
};
type menusGraph = Array<{
  Scalars: menusScalars;
  Parents: menusParentsGraph;
  Children: menusChildrenGraph;
}>;
type mfa_amr_claimsParentsGraph = {
 sessions: OmitChildGraph<sessionsGraph, "mfa_amr_claims">;
};
type mfa_amr_claimsChildrenGraph = {

};
type mfa_amr_claimsGraph = Array<{
  Scalars: mfa_amr_claimsScalars;
  Parents: mfa_amr_claimsParentsGraph;
  Children: mfa_amr_claimsChildrenGraph;
}>;
type mfa_challengesParentsGraph = {
 mfa_factors: OmitChildGraph<mfa_factorsGraph, "mfa_challenges">;
};
type mfa_challengesChildrenGraph = {

};
type mfa_challengesGraph = Array<{
  Scalars: mfa_challengesScalars;
  Parents: mfa_challengesParentsGraph;
  Children: mfa_challengesChildrenGraph;
}>;
type mfa_factorsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "mfa_factors">;
};
type mfa_factorsChildrenGraph = {
 mfa_challenges: OmitParentGraph<mfa_challengesGraph, "mfa_factors">;
};
type mfa_factorsGraph = Array<{
  Scalars: mfa_factorsScalars;
  Parents: mfa_factorsParentsGraph;
  Children: mfa_factorsChildrenGraph;
}>;
type storage_migrationsParentsGraph = {

};
type storage_migrationsChildrenGraph = {

};
type storage_migrationsGraph = Array<{
  Scalars: storage_migrationsScalars;
  Parents: storage_migrationsParentsGraph;
  Children: storage_migrationsChildrenGraph;
}>;
type supabase_functions_migrationsParentsGraph = {

};
type supabase_functions_migrationsChildrenGraph = {

};
type supabase_functions_migrationsGraph = Array<{
  Scalars: supabase_functions_migrationsScalars;
  Parents: supabase_functions_migrationsParentsGraph;
  Children: supabase_functions_migrationsChildrenGraph;
}>;
type none_alimentary_productsParentsGraph = {
 store_areas: OmitChildGraph<store_areasGraph, "none_alimentary_products">;
};
type none_alimentary_productsChildrenGraph = {
 none_alimentary_products_shopping_lists: OmitParentGraph<none_alimentary_products_shopping_listsGraph, "none_alimentary_products">;
};
type none_alimentary_productsGraph = Array<{
  Scalars: none_alimentary_productsScalars;
  Parents: none_alimentary_productsParentsGraph;
  Children: none_alimentary_productsChildrenGraph;
}>;
type none_alimentary_products_shopping_listsParentsGraph = {
 none_alimentary_products: OmitChildGraph<none_alimentary_productsGraph, "none_alimentary_products_shopping_lists">;
 shopping_lists: OmitChildGraph<shopping_listsGraph, "none_alimentary_products_shopping_lists">;
};
type none_alimentary_products_shopping_listsChildrenGraph = {

};
type none_alimentary_products_shopping_listsGraph = Array<{
  Scalars: none_alimentary_products_shopping_listsScalars;
  Parents: none_alimentary_products_shopping_listsParentsGraph;
  Children: none_alimentary_products_shopping_listsChildrenGraph;
}>;
type objectsParentsGraph = {
 buckets: OmitChildGraph<bucketsGraph, "objects">;
};
type objectsChildrenGraph = {

};
type objectsGraph = Array<{
  Scalars: objectsScalars;
  Parents: objectsParentsGraph;
  Children: objectsChildrenGraph;
}>;
type recipesParentsGraph = {
 meal_category: OmitChildGraph<meal_categoryGraph, "recipes">;
 public_users: OmitChildGraph<public_usersGraph, "recipes">;
};
type recipesChildrenGraph = {
 recipes_alimentary_products: OmitParentGraph<recipes_alimentary_productsGraph, "recipes">;
 recipes_kitchen_equipments: OmitParentGraph<recipes_kitchen_equipmentsGraph, "recipes">;
 recipes_menus: OmitParentGraph<recipes_menusGraph, "recipes">;
};
type recipesGraph = Array<{
  Scalars: recipesScalars;
  Parents: recipesParentsGraph;
  Children: recipesChildrenGraph;
}>;
type recipes_alimentary_productsParentsGraph = {
 alimentary_products: OmitChildGraph<alimentary_productsGraph, "recipes_alimentary_products">;
 recipes: OmitChildGraph<recipesGraph, "recipes_alimentary_products">;
};
type recipes_alimentary_productsChildrenGraph = {

};
type recipes_alimentary_productsGraph = Array<{
  Scalars: recipes_alimentary_productsScalars;
  Parents: recipes_alimentary_productsParentsGraph;
  Children: recipes_alimentary_productsChildrenGraph;
}>;
type recipes_kitchen_equipmentsParentsGraph = {
 kitchen_equipments: OmitChildGraph<kitchen_equipmentsGraph, "recipes_kitchen_equipments">;
 recipes: OmitChildGraph<recipesGraph, "recipes_kitchen_equipments">;
};
type recipes_kitchen_equipmentsChildrenGraph = {

};
type recipes_kitchen_equipmentsGraph = Array<{
  Scalars: recipes_kitchen_equipmentsScalars;
  Parents: recipes_kitchen_equipmentsParentsGraph;
  Children: recipes_kitchen_equipmentsChildrenGraph;
}>;
type recipes_menusParentsGraph = {
 menus: OmitChildGraph<menusGraph, "recipes_menus">;
 recipes: OmitChildGraph<recipesGraph, "recipes_menus">;
};
type recipes_menusChildrenGraph = {

};
type recipes_menusGraph = Array<{
  Scalars: recipes_menusScalars;
  Parents: recipes_menusParentsGraph;
  Children: recipes_menusChildrenGraph;
}>;
type refresh_tokensParentsGraph = {
 sessions: OmitChildGraph<sessionsGraph, "refresh_tokens">;
};
type refresh_tokensChildrenGraph = {

};
type refresh_tokensGraph = Array<{
  Scalars: refresh_tokensScalars;
  Parents: refresh_tokensParentsGraph;
  Children: refresh_tokensChildrenGraph;
}>;
type saml_providersParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "saml_providers">;
};
type saml_providersChildrenGraph = {

};
type saml_providersGraph = Array<{
  Scalars: saml_providersScalars;
  Parents: saml_providersParentsGraph;
  Children: saml_providersChildrenGraph;
}>;
type saml_relay_statesParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "saml_relay_states">;
};
type saml_relay_statesChildrenGraph = {

};
type saml_relay_statesGraph = Array<{
  Scalars: saml_relay_statesScalars;
  Parents: saml_relay_statesParentsGraph;
  Children: saml_relay_statesChildrenGraph;
}>;
type auth_schema_migrationsParentsGraph = {

};
type auth_schema_migrationsChildrenGraph = {

};
type auth_schema_migrationsGraph = Array<{
  Scalars: auth_schema_migrationsScalars;
  Parents: auth_schema_migrationsParentsGraph;
  Children: auth_schema_migrationsChildrenGraph;
}>;
type supabase_migrations_schema_migrationsParentsGraph = {

};
type supabase_migrations_schema_migrationsChildrenGraph = {

};
type supabase_migrations_schema_migrationsGraph = Array<{
  Scalars: supabase_migrations_schema_migrationsScalars;
  Parents: supabase_migrations_schema_migrationsParentsGraph;
  Children: supabase_migrations_schema_migrationsChildrenGraph;
}>;
type secretsParentsGraph = {
 key: OmitChildGraph<keyGraph, "secrets">;
};
type secretsChildrenGraph = {

};
type secretsGraph = Array<{
  Scalars: secretsScalars;
  Parents: secretsParentsGraph;
  Children: secretsChildrenGraph;
}>;
type sessionsParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "sessions">;
};
type sessionsChildrenGraph = {
 mfa_amr_claims: OmitParentGraph<mfa_amr_claimsGraph, "sessions">;
 refresh_tokens: OmitParentGraph<refresh_tokensGraph, "sessions">;
};
type sessionsGraph = Array<{
  Scalars: sessionsScalars;
  Parents: sessionsParentsGraph;
  Children: sessionsChildrenGraph;
}>;
type shopping_listsParentsGraph = {
 households: OmitChildGraph<householdsGraph, "shopping_lists">;
 menus: OmitChildGraph<menusGraph, "shopping_lists">;
};
type shopping_listsChildrenGraph = {
 alimentary_products_shopping_lists: OmitParentGraph<alimentary_products_shopping_listsGraph, "shopping_lists">;
 none_alimentary_products_shopping_lists: OmitParentGraph<none_alimentary_products_shopping_listsGraph, "shopping_lists">;
};
type shopping_listsGraph = Array<{
  Scalars: shopping_listsScalars;
  Parents: shopping_listsParentsGraph;
  Children: shopping_listsChildrenGraph;
}>;
type sso_domainsParentsGraph = {
 sso_providers: OmitChildGraph<sso_providersGraph, "sso_domains">;
};
type sso_domainsChildrenGraph = {

};
type sso_domainsGraph = Array<{
  Scalars: sso_domainsScalars;
  Parents: sso_domainsParentsGraph;
  Children: sso_domainsChildrenGraph;
}>;
type sso_providersParentsGraph = {

};
type sso_providersChildrenGraph = {
 saml_providers: OmitParentGraph<saml_providersGraph, "sso_providers">;
 saml_relay_states: OmitParentGraph<saml_relay_statesGraph, "sso_providers">;
 sso_domains: OmitParentGraph<sso_domainsGraph, "sso_providers">;
};
type sso_providersGraph = Array<{
  Scalars: sso_providersScalars;
  Parents: sso_providersParentsGraph;
  Children: sso_providersChildrenGraph;
}>;
type store_areasParentsGraph = {

};
type store_areasChildrenGraph = {
 alimentary_products: OmitParentGraph<alimentary_productsGraph, "store_areas">;
 none_alimentary_products: OmitParentGraph<none_alimentary_productsGraph, "store_areas">;
};
type store_areasGraph = Array<{
  Scalars: store_areasScalars;
  Parents: store_areasParentsGraph;
  Children: store_areasChildrenGraph;
}>;
type auth_usersParentsGraph = {

};
type auth_usersChildrenGraph = {
 identities: OmitParentGraph<identitiesGraph, "auth_users">;
 mfa_factors: OmitParentGraph<mfa_factorsGraph, "auth_users">;
 sessions: OmitParentGraph<sessionsGraph, "auth_users">;
 public_users: OmitParentGraph<public_usersGraph, "auth_users">;
};
type auth_usersGraph = Array<{
  Scalars: auth_usersScalars;
  Parents: auth_usersParentsGraph;
  Children: auth_usersChildrenGraph;
}>;
type public_usersParentsGraph = {
 auth_users: OmitChildGraph<auth_usersGraph, "public_users">;
 households: OmitChildGraph<householdsGraph, "public_users">;
};
type public_usersChildrenGraph = {
 menus: OmitParentGraph<menusGraph, "public_users">;
 recipes: OmitParentGraph<recipesGraph, "public_users">;
};
type public_usersGraph = Array<{
  Scalars: public_usersScalars;
  Parents: public_usersParentsGraph;
  Children: public_usersChildrenGraph;
}>;
type Graph = {
  _http_response: _http_responseGraph;
  alimentary_products: alimentary_productsGraph;
  alimentary_products_shopping_lists: alimentary_products_shopping_listsGraph;
  audit_log_entries: audit_log_entriesGraph;
  buckets: bucketsGraph;
  flow_state: flow_stateGraph;
  hooks: hooksGraph;
  households: householdsGraph;
  households_kitchen_equipments: households_kitchen_equipmentsGraph;
  http_request_queue: http_request_queueGraph;
  identities: identitiesGraph;
  instances: instancesGraph;
  key: keyGraph;
  kitchen_equipments: kitchen_equipmentsGraph;
  meal_category: meal_categoryGraph;
  menus: menusGraph;
  mfa_amr_claims: mfa_amr_claimsGraph;
  mfa_challenges: mfa_challengesGraph;
  mfa_factors: mfa_factorsGraph;
  storage_migrations: storage_migrationsGraph;
  supabase_functions_migrations: supabase_functions_migrationsGraph;
  none_alimentary_products: none_alimentary_productsGraph;
  none_alimentary_products_shopping_lists: none_alimentary_products_shopping_listsGraph;
  objects: objectsGraph;
  recipes: recipesGraph;
  recipes_alimentary_products: recipes_alimentary_productsGraph;
  recipes_kitchen_equipments: recipes_kitchen_equipmentsGraph;
  recipes_menus: recipes_menusGraph;
  refresh_tokens: refresh_tokensGraph;
  saml_providers: saml_providersGraph;
  saml_relay_states: saml_relay_statesGraph;
  auth_schema_migrations: auth_schema_migrationsGraph;
  supabase_migrations_schema_migrations: supabase_migrations_schema_migrationsGraph;
  secrets: secretsGraph;
  sessions: sessionsGraph;
  shopping_lists: shopping_listsGraph;
  sso_domains: sso_domainsGraph;
  sso_providers: sso_providersGraph;
  store_areas: store_areasGraph;
  auth_users: auth_usersGraph;
  public_users: public_usersGraph;
};
type ScalarField = {
  name: string;
  type: string;
};
type ObjectField = ScalarField & {
  relationFromFields: string[];
  relationToFields: string[];
};
type Inflection = {
  modelName?: (name: string) => string;
  scalarField?: (field: ScalarField) => string;
  parentField?: (field: ObjectField, oppositeBaseNameMap: Record<string, string>) => string;
  childField?: (field: ObjectField, oppositeField: ObjectField, oppositeBaseNameMap: Record<string, string>) => string;
  oppositeBaseNameMap?: Record<string, string>;
};
type Override = {
  _http_response?: {
    name?: string;
    fields?: {
      id?: string;
      status_code?: string;
      content_type?: string;
      headers?: string;
      content?: string;
      timed_out?: string;
      error_msg?: string;
      created?: string;
    };
  }
  alimentary_products?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      guide_price?: string;
      store_area_id?: string;
      name_fr?: string;
      image_url?: string;
      store_areas?: string;
      alimentary_products_shopping_lists?: string;
      recipes_alimentary_products?: string;
    };
  }
  alimentary_products_shopping_lists?: {
    name?: string;
    fields?: {
      id?: string;
      shopping_list_id?: string;
      alimentary_product_id?: string;
      alimentary_products?: string;
      shopping_lists?: string;
    };
  }
  audit_log_entries?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      payload?: string;
      created_at?: string;
      ip_address?: string;
    };
  }
  buckets?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      owner?: string;
      created_at?: string;
      updated_at?: string;
      public?: string;
      avif_autodetection?: string;
      file_size_limit?: string;
      allowed_mime_types?: string;
      owner_id?: string;
      objects?: string;
    };
  }
  flow_state?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      auth_code?: string;
      code_challenge_method?: string;
      code_challenge?: string;
      provider_type?: string;
      provider_access_token?: string;
      provider_refresh_token?: string;
      created_at?: string;
      updated_at?: string;
      authentication_method?: string;
    };
  }
  hooks?: {
    name?: string;
    fields?: {
      id?: string;
      hook_table_id?: string;
      hook_name?: string;
      created_at?: string;
      request_id?: string;
    };
  }
  households?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      created_at?: string;
      user_id?: string;
      public_users?: string;
      households_kitchen_equipments?: string;
      shopping_lists?: string;
      public_users?: string;
    };
  }
  households_kitchen_equipments?: {
    name?: string;
    fields?: {
      id?: string;
      household_id?: string;
      kitchen_equipment_id?: string;
      households?: string;
      kitchen_equipments?: string;
    };
  }
  http_request_queue?: {
    name?: string;
    fields?: {
      id?: string;
      method?: string;
      url?: string;
      headers?: string;
      body?: string;
      timeout_milliseconds?: string;
    };
  }
  identities?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      identity_data?: string;
      provider?: string;
      last_sign_in_at?: string;
      created_at?: string;
      updated_at?: string;
      email?: string;
      auth_users?: string;
    };
  }
  instances?: {
    name?: string;
    fields?: {
      id?: string;
      uuid?: string;
      raw_base_config?: string;
      created_at?: string;
      updated_at?: string;
    };
  }
  key?: {
    name?: string;
    fields?: {
      id?: string;
      status?: string;
      created?: string;
      expires?: string;
      key_type?: string;
      key_id?: string;
      key_context?: string;
      name?: string;
      associated_data?: string;
      raw_key?: string;
      raw_key_nonce?: string;
      parent_key?: string;
      comment?: string;
      user_data?: string;
      key?: string;
      key?: string;
      secrets?: string;
    };
  }
  kitchen_equipments?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      name_fr?: string;
      image_url?: string;
      households_kitchen_equipments?: string;
      recipes_kitchen_equipments?: string;
    };
  }
  meal_category?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      name_fr?: string;
      recipes?: string;
    };
  }
  menus?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      user_id?: string;
      is_public?: string;
      public_users?: string;
      recipes_menus?: string;
      shopping_lists?: string;
    };
  }
  mfa_amr_claims?: {
    name?: string;
    fields?: {
      session_id?: string;
      created_at?: string;
      updated_at?: string;
      authentication_method?: string;
      id?: string;
      sessions?: string;
    };
  }
  mfa_challenges?: {
    name?: string;
    fields?: {
      id?: string;
      factor_id?: string;
      created_at?: string;
      verified_at?: string;
      ip_address?: string;
      mfa_factors?: string;
    };
  }
  mfa_factors?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      friendly_name?: string;
      factor_type?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
      secret?: string;
      auth_users?: string;
      mfa_challenges?: string;
    };
  }
  storage_migrations?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      hash?: string;
      executed_at?: string;
    };
  }
  supabase_functions_migrations?: {
    name?: string;
    fields?: {
      version?: string;
      inserted_at?: string;
    };
  }
  none_alimentary_products?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      guide_price_per_kg?: string;
      store_area_id?: string;
      store_areas?: string;
      none_alimentary_products_shopping_lists?: string;
    };
  }
  none_alimentary_products_shopping_lists?: {
    name?: string;
    fields?: {
      id?: string;
      none_alimentary_products_id?: string;
      shopping_list_id?: string;
      none_alimentary_products?: string;
      shopping_lists?: string;
    };
  }
  objects?: {
    name?: string;
    fields?: {
      id?: string;
      bucket_id?: string;
      name?: string;
      owner?: string;
      created_at?: string;
      updated_at?: string;
      last_accessed_at?: string;
      metadata?: string;
      path_tokens?: string;
      version?: string;
      owner_id?: string;
      buckets?: string;
    };
  }
  recipes?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      name?: string;
      author?: string;
      is_public?: string;
      description?: string;
      content?: string;
      cooking_time?: string;
      image_url?: string;
      meal_category_id?: string;
      meal_category?: string;
      public_users?: string;
      recipes_alimentary_products?: string;
      recipes_kitchen_equipments?: string;
      recipes_menus?: string;
    };
  }
  recipes_alimentary_products?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      recipe_id?: string;
      alimentary_product_id?: string;
      quantity?: string;
      unit?: string;
      alimentary_products?: string;
      recipes?: string;
    };
  }
  recipes_kitchen_equipments?: {
    name?: string;
    fields?: {
      id?: string;
      recipe_id?: string;
      kitchen_equipment_id?: string;
      kitchen_equipments?: string;
      recipes?: string;
    };
  }
  recipes_menus?: {
    name?: string;
    fields?: {
      id?: string;
      menu_id?: string;
      recipe_id?: string;
      menus?: string;
      recipes?: string;
    };
  }
  refresh_tokens?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      token?: string;
      user_id?: string;
      revoked?: string;
      created_at?: string;
      updated_at?: string;
      parent?: string;
      session_id?: string;
      sessions?: string;
    };
  }
  saml_providers?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      entity_id?: string;
      metadata_xml?: string;
      metadata_url?: string;
      attribute_mapping?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  saml_relay_states?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      request_id?: string;
      for_email?: string;
      redirect_to?: string;
      from_ip_address?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  auth_schema_migrations?: {
    name?: string;
    fields?: {
      version?: string;
    };
  }
  supabase_migrations_schema_migrations?: {
    name?: string;
    fields?: {
      version?: string;
      statements?: string;
      name?: string;
    };
  }
  secrets?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      description?: string;
      secret?: string;
      key_id?: string;
      nonce?: string;
      created_at?: string;
      updated_at?: string;
      key?: string;
    };
  }
  sessions?: {
    name?: string;
    fields?: {
      id?: string;
      user_id?: string;
      created_at?: string;
      updated_at?: string;
      factor_id?: string;
      aal?: string;
      not_after?: string;
      auth_users?: string;
      mfa_amr_claims?: string;
      refresh_tokens?: string;
    };
  }
  shopping_lists?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      household_id?: string;
      menu_id?: string;
      is_related_to_a_menu?: string;
      households?: string;
      menus?: string;
      alimentary_products_shopping_lists?: string;
      none_alimentary_products_shopping_lists?: string;
    };
  }
  sso_domains?: {
    name?: string;
    fields?: {
      id?: string;
      sso_provider_id?: string;
      domain?: string;
      created_at?: string;
      updated_at?: string;
      sso_providers?: string;
    };
  }
  sso_providers?: {
    name?: string;
    fields?: {
      id?: string;
      resource_id?: string;
      created_at?: string;
      updated_at?: string;
      saml_providers?: string;
      saml_relay_states?: string;
      sso_domains?: string;
    };
  }
  store_areas?: {
    name?: string;
    fields?: {
      id?: string;
      name?: string;
      name_fr?: string;
      alimentary_products?: string;
      none_alimentary_products?: string;
    };
  }
  auth_users?: {
    name?: string;
    fields?: {
      instance_id?: string;
      id?: string;
      aud?: string;
      role?: string;
      email?: string;
      encrypted_password?: string;
      email_confirmed_at?: string;
      invited_at?: string;
      confirmation_token?: string;
      confirmation_sent_at?: string;
      recovery_token?: string;
      recovery_sent_at?: string;
      email_change_token_new?: string;
      email_change?: string;
      email_change_sent_at?: string;
      last_sign_in_at?: string;
      raw_app_meta_data?: string;
      raw_user_meta_data?: string;
      is_super_admin?: string;
      created_at?: string;
      updated_at?: string;
      phone?: string;
      phone_confirmed_at?: string;
      phone_change?: string;
      phone_change_token?: string;
      phone_change_sent_at?: string;
      confirmed_at?: string;
      email_change_token_current?: string;
      email_change_confirm_status?: string;
      banned_until?: string;
      reauthentication_token?: string;
      reauthentication_sent_at?: string;
      is_sso_user?: string;
      deleted_at?: string;
      identities?: string;
      mfa_factors?: string;
      sessions?: string;
      public_users?: string;
    };
  }
  public_users?: {
    name?: string;
    fields?: {
      id?: string;
      created_at?: string;
      user_id?: string;
      username?: string;
      first_name?: string;
      last_name?: string;
      age?: string;
      household_id?: string;
      tutorial_completed?: string;
      auth_users?: string;
      households?: string;
      households?: string;
      menus?: string;
      recipes?: string;
    };
  }}
export type Alias = {
  inflection?: Inflection | boolean;
  override?: Override;
};
export declare class SnapletClientBase {
  /**
   * Generate one or more `_http_response`.
   * @example With static inputs:
   * ```ts
   * snaplet._http_response([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet._http_response((x) => x(3));
   * snaplet._http_response((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet._http_response((x) => [{}, ...x(3), {}]);
   * ```
   */
  _http_response: (
    inputs: _http_responseChildInputs<["_http_response"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `alimentary_products`.
   * @example With static inputs:
   * ```ts
   * snaplet.alimentary_products([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.alimentary_products((x) => x(3));
   * snaplet.alimentary_products((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.alimentary_products((x) => [{}, ...x(3), {}]);
   * ```
   */
  alimentary_products: (
    inputs: alimentary_productsChildInputs<["alimentary_products"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `alimentary_products_shopping_lists`.
   * @example With static inputs:
   * ```ts
   * snaplet.alimentary_products_shopping_lists([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.alimentary_products_shopping_lists((x) => x(3));
   * snaplet.alimentary_products_shopping_lists((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.alimentary_products_shopping_lists((x) => [{}, ...x(3), {}]);
   * ```
   */
  alimentary_products_shopping_lists: (
    inputs: alimentary_products_shopping_listsChildInputs<["alimentary_products_shopping_lists"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `audit_log_entries`.
   * @example With static inputs:
   * ```ts
   * snaplet.audit_log_entries([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.audit_log_entries((x) => x(3));
   * snaplet.audit_log_entries((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.audit_log_entries((x) => [{}, ...x(3), {}]);
   * ```
   */
  audit_log_entries: (
    inputs: audit_log_entriesChildInputs<["audit_log_entries"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `buckets`.
   * @example With static inputs:
   * ```ts
   * snaplet.buckets([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.buckets((x) => x(3));
   * snaplet.buckets((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.buckets((x) => [{}, ...x(3), {}]);
   * ```
   */
  buckets: (
    inputs: bucketsChildInputs<["buckets"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `flow_state`.
   * @example With static inputs:
   * ```ts
   * snaplet.flow_state([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.flow_state((x) => x(3));
   * snaplet.flow_state((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.flow_state((x) => [{}, ...x(3), {}]);
   * ```
   */
  flow_state: (
    inputs: flow_stateChildInputs<["flow_state"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `hooks`.
   * @example With static inputs:
   * ```ts
   * snaplet.hooks([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.hooks((x) => x(3));
   * snaplet.hooks((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.hooks((x) => [{}, ...x(3), {}]);
   * ```
   */
  hooks: (
    inputs: hooksChildInputs<["hooks"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `households`.
   * @example With static inputs:
   * ```ts
   * snaplet.households([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.households((x) => x(3));
   * snaplet.households((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.households((x) => [{}, ...x(3), {}]);
   * ```
   */
  households: (
    inputs: householdsChildInputs<["households"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `households_kitchen_equipments`.
   * @example With static inputs:
   * ```ts
   * snaplet.households_kitchen_equipments([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.households_kitchen_equipments((x) => x(3));
   * snaplet.households_kitchen_equipments((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.households_kitchen_equipments((x) => [{}, ...x(3), {}]);
   * ```
   */
  households_kitchen_equipments: (
    inputs: households_kitchen_equipmentsChildInputs<["households_kitchen_equipments"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `http_request_queue`.
   * @example With static inputs:
   * ```ts
   * snaplet.http_request_queue([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.http_request_queue((x) => x(3));
   * snaplet.http_request_queue((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.http_request_queue((x) => [{}, ...x(3), {}]);
   * ```
   */
  http_request_queue: (
    inputs: http_request_queueChildInputs<["http_request_queue"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `identities`.
   * @example With static inputs:
   * ```ts
   * snaplet.identities([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.identities((x) => x(3));
   * snaplet.identities((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.identities((x) => [{}, ...x(3), {}]);
   * ```
   */
  identities: (
    inputs: identitiesChildInputs<["identities"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `instances`.
   * @example With static inputs:
   * ```ts
   * snaplet.instances([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.instances((x) => x(3));
   * snaplet.instances((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.instances((x) => [{}, ...x(3), {}]);
   * ```
   */
  instances: (
    inputs: instancesChildInputs<["instances"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `key`.
   * @example With static inputs:
   * ```ts
   * snaplet.key([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.key((x) => x(3));
   * snaplet.key((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.key((x) => [{}, ...x(3), {}]);
   * ```
   */
  key: (
    inputs: keyChildInputs<["key"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `kitchen_equipments`.
   * @example With static inputs:
   * ```ts
   * snaplet.kitchen_equipments([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.kitchen_equipments((x) => x(3));
   * snaplet.kitchen_equipments((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.kitchen_equipments((x) => [{}, ...x(3), {}]);
   * ```
   */
  kitchen_equipments: (
    inputs: kitchen_equipmentsChildInputs<["kitchen_equipments"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `meal_category`.
   * @example With static inputs:
   * ```ts
   * snaplet.meal_category([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.meal_category((x) => x(3));
   * snaplet.meal_category((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.meal_category((x) => [{}, ...x(3), {}]);
   * ```
   */
  meal_category: (
    inputs: meal_categoryChildInputs<["meal_category"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `menus`.
   * @example With static inputs:
   * ```ts
   * snaplet.menus([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.menus((x) => x(3));
   * snaplet.menus((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.menus((x) => [{}, ...x(3), {}]);
   * ```
   */
  menus: (
    inputs: menusChildInputs<["menus"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_amr_claims`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_amr_claims([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_amr_claims((x) => x(3));
   * snaplet.mfa_amr_claims((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_amr_claims((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_amr_claims: (
    inputs: mfa_amr_claimsChildInputs<["mfa_amr_claims"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_challenges`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_challenges([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_challenges((x) => x(3));
   * snaplet.mfa_challenges((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_challenges((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_challenges: (
    inputs: mfa_challengesChildInputs<["mfa_challenges"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `mfa_factors`.
   * @example With static inputs:
   * ```ts
   * snaplet.mfa_factors([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.mfa_factors((x) => x(3));
   * snaplet.mfa_factors((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.mfa_factors((x) => [{}, ...x(3), {}]);
   * ```
   */
  mfa_factors: (
    inputs: mfa_factorsChildInputs<["mfa_factors"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `storage_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.storage_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.storage_migrations((x) => x(3));
   * snaplet.storage_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.storage_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  storage_migrations: (
    inputs: storage_migrationsChildInputs<["storage_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `supabase_functions_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.supabase_functions_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.supabase_functions_migrations((x) => x(3));
   * snaplet.supabase_functions_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.supabase_functions_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  supabase_functions_migrations: (
    inputs: supabase_functions_migrationsChildInputs<["supabase_functions_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `none_alimentary_products`.
   * @example With static inputs:
   * ```ts
   * snaplet.none_alimentary_products([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.none_alimentary_products((x) => x(3));
   * snaplet.none_alimentary_products((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.none_alimentary_products((x) => [{}, ...x(3), {}]);
   * ```
   */
  none_alimentary_products: (
    inputs: none_alimentary_productsChildInputs<["none_alimentary_products"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `none_alimentary_products_shopping_lists`.
   * @example With static inputs:
   * ```ts
   * snaplet.none_alimentary_products_shopping_lists([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.none_alimentary_products_shopping_lists((x) => x(3));
   * snaplet.none_alimentary_products_shopping_lists((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.none_alimentary_products_shopping_lists((x) => [{}, ...x(3), {}]);
   * ```
   */
  none_alimentary_products_shopping_lists: (
    inputs: none_alimentary_products_shopping_listsChildInputs<["none_alimentary_products_shopping_lists"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `objects`.
   * @example With static inputs:
   * ```ts
   * snaplet.objects([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.objects((x) => x(3));
   * snaplet.objects((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.objects((x) => [{}, ...x(3), {}]);
   * ```
   */
  objects: (
    inputs: objectsChildInputs<["objects"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `recipes`.
   * @example With static inputs:
   * ```ts
   * snaplet.recipes([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.recipes((x) => x(3));
   * snaplet.recipes((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.recipes((x) => [{}, ...x(3), {}]);
   * ```
   */
  recipes: (
    inputs: recipesChildInputs<["recipes"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `recipes_alimentary_products`.
   * @example With static inputs:
   * ```ts
   * snaplet.recipes_alimentary_products([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.recipes_alimentary_products((x) => x(3));
   * snaplet.recipes_alimentary_products((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.recipes_alimentary_products((x) => [{}, ...x(3), {}]);
   * ```
   */
  recipes_alimentary_products: (
    inputs: recipes_alimentary_productsChildInputs<["recipes_alimentary_products"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `recipes_kitchen_equipments`.
   * @example With static inputs:
   * ```ts
   * snaplet.recipes_kitchen_equipments([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.recipes_kitchen_equipments((x) => x(3));
   * snaplet.recipes_kitchen_equipments((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.recipes_kitchen_equipments((x) => [{}, ...x(3), {}]);
   * ```
   */
  recipes_kitchen_equipments: (
    inputs: recipes_kitchen_equipmentsChildInputs<["recipes_kitchen_equipments"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `recipes_menus`.
   * @example With static inputs:
   * ```ts
   * snaplet.recipes_menus([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.recipes_menus((x) => x(3));
   * snaplet.recipes_menus((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.recipes_menus((x) => [{}, ...x(3), {}]);
   * ```
   */
  recipes_menus: (
    inputs: recipes_menusChildInputs<["recipes_menus"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `refresh_tokens`.
   * @example With static inputs:
   * ```ts
   * snaplet.refresh_tokens([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.refresh_tokens((x) => x(3));
   * snaplet.refresh_tokens((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.refresh_tokens((x) => [{}, ...x(3), {}]);
   * ```
   */
  refresh_tokens: (
    inputs: refresh_tokensChildInputs<["refresh_tokens"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `saml_providers`.
   * @example With static inputs:
   * ```ts
   * snaplet.saml_providers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.saml_providers((x) => x(3));
   * snaplet.saml_providers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.saml_providers((x) => [{}, ...x(3), {}]);
   * ```
   */
  saml_providers: (
    inputs: saml_providersChildInputs<["saml_providers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `saml_relay_states`.
   * @example With static inputs:
   * ```ts
   * snaplet.saml_relay_states([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.saml_relay_states((x) => x(3));
   * snaplet.saml_relay_states((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.saml_relay_states((x) => [{}, ...x(3), {}]);
   * ```
   */
  saml_relay_states: (
    inputs: saml_relay_statesChildInputs<["saml_relay_states"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `auth_schema_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.auth_schema_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.auth_schema_migrations((x) => x(3));
   * snaplet.auth_schema_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.auth_schema_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  auth_schema_migrations: (
    inputs: auth_schema_migrationsChildInputs<["auth_schema_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `supabase_migrations_schema_migrations`.
   * @example With static inputs:
   * ```ts
   * snaplet.supabase_migrations_schema_migrations([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.supabase_migrations_schema_migrations((x) => x(3));
   * snaplet.supabase_migrations_schema_migrations((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.supabase_migrations_schema_migrations((x) => [{}, ...x(3), {}]);
   * ```
   */
  supabase_migrations_schema_migrations: (
    inputs: supabase_migrations_schema_migrationsChildInputs<["supabase_migrations_schema_migrations"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `secrets`.
   * @example With static inputs:
   * ```ts
   * snaplet.secrets([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.secrets((x) => x(3));
   * snaplet.secrets((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.secrets((x) => [{}, ...x(3), {}]);
   * ```
   */
  secrets: (
    inputs: secretsChildInputs<["secrets"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sessions`.
   * @example With static inputs:
   * ```ts
   * snaplet.sessions([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sessions((x) => x(3));
   * snaplet.sessions((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sessions((x) => [{}, ...x(3), {}]);
   * ```
   */
  sessions: (
    inputs: sessionsChildInputs<["sessions"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `shopping_lists`.
   * @example With static inputs:
   * ```ts
   * snaplet.shopping_lists([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.shopping_lists((x) => x(3));
   * snaplet.shopping_lists((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.shopping_lists((x) => [{}, ...x(3), {}]);
   * ```
   */
  shopping_lists: (
    inputs: shopping_listsChildInputs<["shopping_lists"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sso_domains`.
   * @example With static inputs:
   * ```ts
   * snaplet.sso_domains([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sso_domains((x) => x(3));
   * snaplet.sso_domains((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sso_domains((x) => [{}, ...x(3), {}]);
   * ```
   */
  sso_domains: (
    inputs: sso_domainsChildInputs<["sso_domains"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `sso_providers`.
   * @example With static inputs:
   * ```ts
   * snaplet.sso_providers([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.sso_providers((x) => x(3));
   * snaplet.sso_providers((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.sso_providers((x) => [{}, ...x(3), {}]);
   * ```
   */
  sso_providers: (
    inputs: sso_providersChildInputs<["sso_providers"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `store_areas`.
   * @example With static inputs:
   * ```ts
   * snaplet.store_areas([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.store_areas((x) => x(3));
   * snaplet.store_areas((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.store_areas((x) => [{}, ...x(3), {}]);
   * ```
   */
  store_areas: (
    inputs: store_areasChildInputs<["store_areas"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `auth_users`.
   * @example With static inputs:
   * ```ts
   * snaplet.auth_users([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.auth_users((x) => x(3));
   * snaplet.auth_users((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.auth_users((x) => [{}, ...x(3), {}]);
   * ```
   */
  auth_users: (
    inputs: auth_usersChildInputs<["auth_users"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Generate one or more `public_users`.
   * @example With static inputs:
   * ```ts
   * snaplet.public_users([{}, {}]);
   * ```
   * @example Using the `x` helper:
   * ```ts
   * snaplet.public_users((x) => x(3));
   * snaplet.public_users((x) => x({ min: 1, max: 10 }));
   * ```
   * @example Mixing both:
   * ```ts
   * snaplet.public_users((x) => [{}, ...x(3), {}]);
   * ```
   */
  public_users: (
    inputs: public_usersChildInputs<["public_users"]>,
    options?: PlanOptions,
  ) => Plan;
  /**
   * Compose multiple plans together, injecting the store of the previous plan into the next plan.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-pipe | documentation}.
   */
  $pipe: Pipe;
  /**
   * Compose multiple plans together, without injecting the store of the previous plan into the next plan.
   * All stores stay independent and are merged together once all the plans are generated.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#using-merge | documentation}.
   */
  $merge: Merge;
  /**
   * Create a store instance.
   *
   * Learn more in the {@link https://docs.snaplet.dev/core-concepts/generate#augmenting-external-data-with-createstore | documentation}.
   */
  $createStore: CreateStore;
};

export type SnapletClientBaseOptions = {
  userModels?: UserModels
}


type PgClient = {
  query(string): Promise<unknown>
}

export declare class SnapletClient extends SnapletClientBase {
  constructor(pgClient: PgClient, options?: SnapletClientBaseOptions)
}