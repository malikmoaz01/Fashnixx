import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CategoriesDropdown = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = {
    Menswear: [
      { name: "Shirts", path: "/menswear/shirts" },
      { name: "T-Shirts", path: "/menswear/tshirts" },
      { name: "Jeans", path: "/menswear/jeans" },
      { name: "Jackets", path: "/menswear/jackets" },
    ],
    Womenswear: [
      { name: "Dresses", path: "/womenswear/dresses" },
      { name: "Tops", path: "/womenswear/tops" },
      { name: "Skirts", path: "/womenswear/skirts" },
      { name: "Sarees", path: "/womenswear/sarees" },
    ],
    Kidswear: [
      { name: "T-Shirts", path: "/kidswear/tshirts" },
      { name: "Shorts", path: "/kidswear/shorts" },
      { name: "Dresses", path: "/kidswear/dresses" },
      { name: "Nightwear", path: "/kidswear/nightwear" },
    ],
    Accessories: [
      { name: "Bags", path: "/accessories/bags" },
      { name: "Shoes", path: "/accessories/shoes" },
      { name: "Watches", path: "/accessories/watches" },
      { name: "Jewelry", path: "/accessories/jewelry" },
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleCategory = (category) => {
    if (activeCategory === category) {
      setIsDropdownOpen(false); // Close if clicked again
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
      setIsDropdownOpen(true); // Open if clicked
    }
  };

  return (
    <section className="absolute left-0 right-0 z-10 w-full border-b border-r border-l bg-white">
      <div className="mx-auto flex max-w-[1200px] py-10 dropdown">
        {/* Categories List */}
        <div className="w-[300px] border-r">
          <ul className="px-5">
            {Object.keys(categories).map((category) => (
              <li
                key={category}
                onClick={() => toggleCategory(category)}
                className="cursor-pointer flex items-center gap-2 py-2 px-3 hover:bg-neutral-100"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Sub-categories Display */}
        <div className="flex w-full justify-between">
          {isDropdownOpen && activeCategory && (
            <div className="flex gap-6">
              <div className="mx-5">
                <p className="font-medium text-blue-900">
                  {activeCategory.toUpperCase()}
                </p>
                <ul className="text-sm leading-8">
                  {categories[activeCategory].map((subcategory) => (
                    <li key={subcategory.name}>
                      <Link
                        to={subcategory.path}
                        onClick={() => {
                          setIsDropdownOpen(false); // Close dropdown on navigation
                          onNavigate();
                        }}
                        className="hover:underline"
                      >
                        {subcategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesDropdown;
