import {
  Leaf,
  Coffee,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Container from "@/components/shared/Container";
import Reveal from "@/components/shared/Reveal";


const features = [
  {
    icon: Leaf,
    title: "ماچای اصیل ژاپنی",
    desc: "انتخاب شده از بهترین مزارع",
  },
  {
    icon: Coffee,
    title: "قهوه تخصصی",
    desc: "دانه‌های تازه رُست شده",
  },
  {
    icon: ShieldCheck,
    title: "کیفیت تضمین شده",
    desc: "استاندارد کافه‌های تخصصی",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    desc: "تحویل آسان و مطمئن",
  },
];


export default function FeaturesSection(){

return (

<section
className="
bg-[#f8f5ed]
py-10
border-b
border-[#203c27]/10
"
>

<Container>

<div
className="
grid
grid-cols-2
md:grid-cols-4
"
>


{
features.map((item,index)=>{

const Icon=item.icon;


return (

<Reveal
key={item.title}
delay={index * 0.1}
>


<div
className="
group
flex
flex-col
items-center
border-r
border-[#203c27]/10
px-6
text-center

last:border-none
"
>


<div
className="
flex
h-16
w-16
items-center
justify-center
rounded-full
bg-[#355e3b]/10
text-[#355e3b]
transition
duration-500

group-hover:
bg-[#355e3b]

group-hover:
text-white

group-hover:
scale-110
"
>

<Icon size={26}/>

</div>



<h3
className="
mt-5
font-serif
text-lg
font-bold
text-[#203c27]
"
>
{item.title}
</h3>



<p
className="
mt-2
text-sm
leading-7
text-[#203c27]/60
"
>
{item.desc}
</p>



</div>


</Reveal>

)

})
}


</div>


</Container>


</section>

);

}
