import Menu from "../components/Menu";
import React from "react";
import RecipeTable from "../components/RecipeTable";
import PageName from "../components/PageName";

const Saved = () => {
  return (
    <div className="body">
      <Menu/>
      <PageName/>
      <RecipeTable/>
    </div>
  );
};

export default Saved;
