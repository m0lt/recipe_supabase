import { useContext } from "react"
import { mainContext, type MainContextProps } from "../../context/MainProvider"
import CardList from "../../components/card/CardList"

export default function Home() {
  const { recipes } = useContext(mainContext) as MainContextProps

  return (
    <div>
      <div>
        <CardList recipes={recipes} />
      </div>
    </div>
  )
}
