export function PhotoModal({ photos, selectedPhotoIndex, onClose, onPrevious, onNext }) {

  if (selectedPhotoIndex === null) return null;

  const selectedPhotoUrl = photos[selectedPhotoIndex].url;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 group"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedPhotoUrl}
          alt={photos[selectedPhotoIndex].description || `Photo numéro ${selectedPhotoIndex + 1}`}

          className="rounded-lg w-full h-full object-contain"
        />

        {selectedPhotoIndex > 0 && (
          <button
            onClick={onPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2
              bg-black bg-opacity-75 text-white font-bold border border-[#594347]
              rounded-full w-8 h-8 flex items-center justify-center text-lg
              transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            {"‹"}
          </button>
        )}
        {selectedPhotoIndex < photos.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
              bg-black bg-opacity-75 text-white font-bold border border-[#594347]
              rounded-full w-8 h-8 flex items-center justify-center text-lg
              transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            {"›"}
          </button>
        )}
      </div>
    </div>
  );
}