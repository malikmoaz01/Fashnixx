import React from 'react';

const NewArrival = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
              alt="Product 1"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 1</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
              alt="Product 2"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 2</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
              alt="Product 3"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 3</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
              alt="Product 4"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 4</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
              alt="Product 5"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 5</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
              alt="Product 6"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 6</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
              alt="Product 7"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 7</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
              alt="Product 8"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 8</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
              alt="Product 9"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 9</p>
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
              alt="Product 10"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 10</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
              alt="Product 11"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 11</p>
          </div>
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
              alt="Product 12"
            />
            <p className="mt-2 text-center text-sm font-medium">Product 12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
