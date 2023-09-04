import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import format from "date-fns/format";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function App() {
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allProducts, setAllProducts] = useState([]);
  const [open, setOpen] = useState(false);

  // get the target element to toggle
  const refOne = useRef(null);

  useEffect(() => {
    axios
      .get("https://63bb90b3cf99234bfa5e3b48.mockapi.io/Products")
      .then((response) => {
        setProducts(response.data);
        setAllProducts(response.data);
      });

    // event listeners
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
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

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    // console.log(e.key)
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div className="App">
      <header className="calendarWrap">
        <input
          value={`${format(startDate, "MM/dd/yyyy")} to ${format(
            endDate,
            "MM/dd/yyyy"
          )}`}
          type="text"
          onClick={() => setOpen((open) => !open)}
        />
        <div ref={refOne}>
          {open && (
            <DateRange
              ranges={[selectionRange]}
              onChange={handleSelect}
              editableDateInputs={true}
              moveRangeOnFirstSelection={false}
            />
          )}
        </div>

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
