<template>
  <div class="bg-gray-900">
    <div class="relative">
      <div class="absolute inset-0 flex flex-col" aria-hidden="true">
        <div class="flex-0 h-3/4" />
        <div class="flex-1 h-1/4 w-full bg-gray-100" />
      </div>
      <div class="pt-10 md:pt-20 relative z-10">
        <div class="text-center px-4 sm:px-8 max-w-7xl mx-auto">
          <h1
            class="
              text-5xl
              md:text-7xl
              font-bold
              leading-tight
              tracking-tight
              aos-init aos-animate
            "
            data-aos="zoom-y-out"
          >
            <span
              class="
                bg-clip-text
                text-transparent
                bg-gradient-to-r
                from-cyan-300
                via-white
                to-teal-300
              "
              >Single Dispatch</span
            >
          </h1>
          <div class="md:mt-5">
            <p
              class="
                text-2xl
                md:text-5xl
                leading-8
                text-cyan-50
                mb-8
                aos-init aos-animate
              "
              data-aos="zoom-y-out"
              data-aos-delay="150"
            >
              Get a command palette on every website
            </p>
          </div>

          <img
            class="glow mt-12 sm:mt-24 rounded-lg"
            src="@/assets/img/screenshot.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <Features />
    <section id="pricing" class="bg-gray-100">
      <div class="pt-12 sm:pt-16 lg:pt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2
              class="
                text-3xl
                font-extrabold
                text-gray-900
                sm:text-4xl
                lg:text-5xl
              "
            >
              Join our beta!
            </h2>
            <p class="mt-4 text-xl text-gray-600">
              Lock in early-adopter pricing!
            </p>
          </div>
        </div>
      </div>
      <Pricing />
    </section>
  </div>
</template>

<style scoped>
.glow {
  box-shadow: 0 0 20px #2f7083;
}
</style>
