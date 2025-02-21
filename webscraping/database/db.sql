CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    page_link varchar(300) UNIQUE NOT NULL,
    title varchar (100),
    img_url varchar (300)
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    ingredient varchar(50)  UNIQUE NOT NULL
);

CREATE TABLE recipe_ingredients (
    recipe_id integer REFERENCES recipes(id),
    ingredient_id integer REFERENCES ingredients(id),
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE saved_recipes (
    title varchar(100) UNIQUE NOT NULL,
    page_link varchar(300),
    ingredient_list varchar(500)
);
