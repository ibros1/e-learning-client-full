import { Star } from "lucide-react";
import { motion } from "framer-motion";
import AbdinasirPhoto from "../../../public/abdinasir.jpg";
import KhaalidPhoto from "../../../public/khaalid.jpg";
import AmiinPhoto from "../../../public/amiin.jpg";

const Testemonials = () => {
  return (
    <div>
      {" "}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-[#091025]  mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Hear from our community of learners who have transformed their
            careers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {[
            {
              id: 1,
              name: "Abdinasir Mohamed Mohamoud",
              role: "Software Engineer",
              photo: `${AbdinasirPhoto}`,
              feedback:
                "Markii aan go'aansaday in aan barto programming, waxaan ahaa qof ka cabsi qaba code-ka. Waxaan maqli jiray erayo sida HTML, CSS, iyo Python oo iiga muuqan jiray wax qarsoon oo adag. Laakiin markii aan ku biiray koorsooyin tayo leh, waxaan ogaaday in haddii aad si nidaamsan u barato, programming-ka uu yahay ciyaar aad u xiiso badan. Maanta, waxaan si fudud u sameeyaa websites shaqeynaya oo dadka isticmaalaan. Waxa ugu muhiimsan ee aan bartay waa in aanan quusan oo aan ku celceliyo.",
            },
            {
              id: 2,
              name: "Khaalid Fodhaadhi",
              role: "Graphic Desinger",
              photo: `${KhaalidPhoto}`,
              feedback:
                "Anigu waxaan doorbiday farshaxanka iyo naqshadeynta, sidaa darteed waxaan ku biiray graphic design. Markii hore, waxaan moodayay in sawir qurux badan la samaynayo oo keliya, laakiin waxaan ogaaday in graphic design uu leeyahay nidaam, isku dheelitir, iyo faham muuqaal. Waxaan bartay Photoshop, Illustrator, iyo Canva. Waxay iga caawiyeen in aan naqshado posters, logos, iyo social media designs ka soo jiitay macaamiil badan. Hadda, waxaan isku darayaa hal-abuur iyo farsamo, waxaana ka helaa dakhli joogto ah shaqadayda.",
            },
            {
              id: 3,
              name: "Amiin Mohamoud Mouse",
              role: "UI/UX Designer",
              photo: `${AmiinPhoto}`,
              feedback:
                "Anigu markii aan bilaabay barashada programming-ka, waxaan ka baqayay inuu yahay wax adag. Laakiin markii aan helay koorsooyin iyo macallimiin wanaagsan, waxaan si fudud u bartay HTML, CSS, iyo JavaScript. Waxaan awood u yeeshay in aan sameeyao websites fudud oo shaqeynaya. Waxbarashadani waxay i siisay kalsooni iyo fursado shaqo oo fiican.",
            },
          ].map(({ id, name, role, photo, feedback }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: id * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <img
                  src={photo}
                  alt={name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-sm md:text-base">{name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic text-xs md:text-sm mb-3 md:mb-4">
                "{feedback}"
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Testemonials;
