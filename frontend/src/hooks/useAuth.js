import { useContext } from "react";
import AuthContext from "./authContext";

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth

// La función useAuth se utiliza para centralizar el contexto en un mismo método que nos va a ahorrar una importación en todos los componentes donde querramos usarlo. Ademas si quisieramos cambiar el nombre del contexto sería necesario cambiarlo en todos los componentes donde lo usemos, pero de esta manera no hace falta hacerlo ya que no utilizamos el nombre del contexto en los mismos.
// ejemplo de uso sin useAuth --> const { authLogout } = useContext(AuthContext);
// ejemplo de uso con useAuth --> const { authLogout } = useAuth();