"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function Testimonials1() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-muted opacity-20" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            What our users say
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.author.name}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-x-4">
                  <Avatar className="h-12 w-12">
                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                      {testimonial.author.name[0]}
                    </div>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.author.name}</h3>
                    <p className="text-muted-foreground">
                      {testimonial.author.role}
                    </p>
                  </div>
                </div>
                <blockquote className="mt-8">
                  <p>{testimonial.content}</p>
                </blockquote>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    content:
      "The AI agents have transformed how we handle customer support. They're incredibly efficient and always learning.",
    author: {
      name: "Emma Thompson",
      role: "Customer Success Manager",
    },
  },
  {
    content:
      "Integration was seamless, and the results were immediate. Our team's productivity has increased significantly.",
    author: {
      name: "Michael Chen",
      role: "Operations Director",
    },
  },
  {
    content:
      "The natural language processing capabilities are impressive. It feels like talking to a human colleague.",
    author: {
      name: "Sarah Johnson",
      role: "Product Manager",
    },
  },
  {
    content:
      "We've seen a 40% reduction in response times since implementing these AI agents. Game changer!",
    author: {
      name: "David Miller",
      role: "Technical Lead",
    },
  },
];
