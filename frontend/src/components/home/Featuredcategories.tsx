import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/ui/card";


const categories = [
  {
    title: "Matcha",
    description: "ماچاهای اصیل ژاپنی",
  },
  {
    title: "Coffee",
    description: "قهوه‌های پریمیوم",
  },
  {
    title: "Tea",
    description: "انواع چای خاص",
  },
  {
    title: "Accessories",
    description: "ابزار دم‌آوری حرفه‌ای",
  },
];


export default function FeaturedCategories() {
  return (
    <section className="py-20">

      <Container>

        <SectionTitle
          title="دسته‌بندی محصولات"
          description="انتخاب بهترین محصولات برای تجربه‌ای متفاوت"
        />


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <Card key={category.title}>

              <h3 className="text-xl font-semibold text-slate-900">
                {category.title}
              </h3>

              <p className="mt-3 text-sm text-slate-600">
                {category.description}
              </p>

            </Card>
          ))}

        </div>

      </Container>

    </section>
  );
}
