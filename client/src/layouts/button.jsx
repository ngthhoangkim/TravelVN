import React from "react";

export const ButtonIcon = ({ title, Icon }) => {
    return (
        <div>
            <button className="flex items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center me-2 mb-2">
                {title}
                {Icon && <Icon size={25} className="ml-2" />}
            </button>
        </div>
    );
};

export const ButtonGradient = ({ title, onClick }) => {
    return (
        <div>
            <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={onClick} >
                {title}
            </button>
        </div>
    );
};

