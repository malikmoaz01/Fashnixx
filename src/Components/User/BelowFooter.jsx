import React from 'react';

const BelowFooter = () => {
    return (
        <section className="h-11 bg-pink-500">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 pt-2">
                <p>&copy; Malik Moaz, 2025</p>
                <div className="flex items-center space-x-3">
                    <img
                        className="h-8"
                        src="https://cdn-icons-png.flaticon.com/512/733/733609.png"
                        alt="Github icon"
                    />
                    <img
                        className="h-8"
                        src="https://cdn-icons-png.flaticon.com/512/5968/5968144.png"
                        alt="Apple pay icon"
                    />
                    <img
                        className="h-8"
                        src="https://cdn-icons-png.flaticon.com/512/558/558489.png"
                        alt="JazzCash icon"
                    />


                </div>
            </div>
        </section>
    );
};

export default BelowFooter;
