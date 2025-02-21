import React from 'react'
import SearchBar from '../components/SearchBar'
import RecipeDisplay from '../components/RecipeDisplay'
import Menu from '../components/Menu'
import IngredientsContextProvider, {RecipeListContextProvider, SelectedIngredientsContextProvider} from '../context/Context'
import PageName from '../components/PageName'

const Home = () => {
    return (
        <div className = "body">
          <IngredientsContextProvider>
            <SelectedIngredientsContextProvider>
              <RecipeListContextProvider>
                <Menu />
                <PageName/>
                <SearchBar/>
                <RecipeDisplay/>
              </RecipeListContextProvider>
            </SelectedIngredientsContextProvider>
          </IngredientsContextProvider>
        </div>
    )
}

export default Home
