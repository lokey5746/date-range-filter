import { useEffect, useState } from "react";
import axios from "axios";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function App() {
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://63bb90b3cf99234bfa5e3b48.mockapi.io/Products")
      .then((response) => {
        setProducts(response.data);
        setAllProducts(response.data);
      });
  }, []);

  const handleSelect = (date) => {
    let filtered = allProducts.filter((product) => {
      let productDate = new Date(product["createdAt"]);
      return (
        productDate >= date.selection.startDate &&
        productDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setProducts(filtered);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  return (
    <div className="App">
      <header className="App-header">
        <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr>
                  <td>{product["id"]}</td>
                  <td>{product["name"]}</td>
                  <td>{product["createdAt"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
