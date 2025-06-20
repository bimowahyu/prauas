import React from 'react';

const Modal = ({ show, title, message, onConfirm, onCancel, type = 'alert' }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    {type === 'confirm' && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
