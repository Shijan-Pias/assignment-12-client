import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import UseAxios from "../../hook/UseAxios";

const DiscountProducts = () => {
  const axiosInstance = UseAxios();

  const { data: discountMedicines = [], isLoading } = useQuery({
    queryKey: ["discountMedicines"],
    queryFn: async () => {
      const res = await axiosInstance.get("/medicines");
      // filter করে শুধু যেগুলোর discount > 0
      return res.data.filter((med) => med.discount > 0);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
         Discount Products
      </h2>

      {discountMedicines.length === 0 ? (
        <p className="text-center text-gray-500">No discounted products found</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {discountMedicines.map((med) => (
            <SwiperSlide key={med._id}>
              <div className="p-4 border rounded-lg shadow hover:shadow-lg transition mx-12">
                <img
                  src={med.MedicineImage || "https://via.placeholder.com/150"}
                  alt={med.itemName}
                  className="h-40 w-full object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-lg">{med.itemName}</h3>
                <p className="text-sm text-gray-500">{med.genericName}</p>
                <p className="text-sm">{med.category}</p>

                <div className="mt-2 flex gap-2 items-center">
                  <span className="text-red-500 font-bold">
                    ৳{med.finalPrice}
                  </span>
                  <span className="line-through text-gray-400 text-sm">
                    ৳{med.price}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                    -{med.discount}%
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default DiscountProducts;
