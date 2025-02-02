import React, { useState } from "react";
import womenDressImg from "../../assets/Product/Sneaker1.png";
import CasioWatch from "../../assets/Product/Sneaker2.png";
import CoupleSuit from "../../assets/Product/Sneaker3.png";
import GoldenWomenCasual from "../../assets/Product/Sneaker4.png";
import RolexWatch from "../../assets/Product/Sneaker5.png";
import ProductOverview1 from "./ProductOverview1";

const ProductOverview = () => {
  const [selectedImage, setSelectedImage] = useState(womenDressImg);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const sizes = [40, 41, 42, 43, 44];
  const colors = ["white", "black", "red"];

  const colorImageMap = {
    white: CasioWatch,
    black: CoupleSuit,
    red: RolexWatch,
  };

  // Handle color selection to update main image dynamically
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedImage(colorImageMap[color] || womenDressImg);
  };

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div>
            <img
              src={selectedImage}
              alt="Selected Product"
              className="w-full h-96 rounded-lg shadow-lg object-cover"
            />
          </div>
          {/* Thumbnail Images */}
          <div className="grid grid-cols-5 gap-4 mt-4">
            {[womenDressImg, CasioWatch, CoupleSuit, GoldenWomenCasual, RolexWatch].map(
              (img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-full h-20 rounded-lg cursor-pointer border ${
                      selectedImage === img ? "border-blue-900" : ""
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Sneakers</h1>
          <div className="mt-4">
            <span className="text-2xl font-bold text-blue-800">Rs 5000</span>
            <span className="text-gray-400 line-through ml-4">Rs 7500</span>
            <span className="text-green-600 ml-4">33% OFF</span>
          </div>
          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="font-medium text-lg">Size</h3>
            <div className="flex gap-4 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`w-10 h-10 border rounded-lg ${
                    selectedSize === size
                      ? "border-2 border-blue-900 text-blue-900"
                      : "hover:border-blue-800"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Color Selection */}
          <div className="mt-6">
            <h3 className="font-medium text-lg">Color</h3>
            <div className="flex gap-4 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border ${
                    selectedColor === color
                      ? "ring-2 ring-blue-900"
                      : "hover:ring-2 hover:ring-blue-800"
                  } ${
                    color === "red"
                      ? "bg-red-500"
                      : color === "white"
                      ? "bg-white border-gray-300"
                      : "bg-black"
                  }`}
                  onClick={() => handleColorSelect(color)}
                ></button>
              ))}
            </div>
          </div>
          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="font-medium text-lg">Quantity</h3>
            <div className="flex items-center mt-2">
              <button
                className="px-4 py-2 border hover:bg-gray-100"
                onClick={() => handleQuantityChange("decrement")}
              >
                -
              </button>
              <span className="px-6">{quantity}</span>
              <button
                className="px-4 py-2 border hover:bg-gray-100"
                onClick={() => handleQuantityChange("increment")}
              >
                +
              </button>
            </div>
          </div>
          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 bg-blue-800 text-white font-medium rounded-lg shadow hover:bg-blue-900">
              Add to Cart
            </button>
          </div>
        </div>
        
      </div>
      <br></br>
      <br></br>
      <div class="border-t-4 border-black border-double my-4"></div>
      <ProductOverview1 />
    </div>
  );
};

export default ProductOverview;
