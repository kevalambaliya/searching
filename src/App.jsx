import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // to retain the original data
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("https://fakestoreapi.com/products");
      setData(res.data);
      setAllData(res.data);
      const uniqueCategories = [...new Set(res.data.map(item => item.category))];
      setCategories(uniqueCategories);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...allData];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Sorting
    if (sortType === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setData(filtered);
  }, [searchText, sortType, categoryFilter, allData]);

  return (
    <div>
      <h1>Product List</h1>

      <input
        type="text"
        placeholder="Search by title..."
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />

      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="">Sort By</option>
        <option value="title">Title</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>

      <select onChange={(e) => setCategoryFilter(e.target.value)}>
        <option value="all">All Categories</option>
        {categories.map((cat, idx) => (
          <option value={cat} key={idx}>{cat}</option>
        ))}
      </select>

      {data.length ? (
        data.map((item) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default App;
