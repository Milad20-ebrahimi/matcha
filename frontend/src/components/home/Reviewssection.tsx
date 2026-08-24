import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/ui/card";


const reviews = [
  {
    name: "علی رضایی",
    comment: "کیفیت ماچا عالی بود، حس یک کافه ژاپنی واقعی را داشت.",
    rating: 5,
  },
  {
    name: "سارا محمدی",
    comment: "بسته‌بندی و کیفیت محصولات خیلی حرفه‌ای بود.",
    rating: 5,
  },
  {
    name: "محمد کریمی",
    comment: "قهوه و فضای کافه تجربه فوق‌العاده‌ای بود.",
    rating: 4.8,
  },
];


export default function ReviewsSection() {
  return (
    <section className="py-20">

      <Container>

        <SectionTitle
          title="نظرات مشتریان"
          description="تجربه کسانی که MATCH--CAFE را انتخاب کرده‌اند"
        />


        <div className="grid gap-6 md:grid-cols-3">

          {reviews.map((review) => (
            <Card key={review.name}>

              <div className="text-yellow-500">
                ★ {review.rating}
              </div>


              <p className="mt-4 text-sm leading-7 text-slate-600">
                {review.comment}
              </p>


              <h4 className="mt-5 font-semibold text-slate-900">
                {review.name}
              </h4>

            </Card>
          ))}

        </div>

      </Container>

    </section>
  );
}
