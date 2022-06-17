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
              max-w-2xl
              mx-auto
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
            >
              Command Palette</span
            ><span class="block">for any website</span>
          </h1>
          <div class="md:mt-5">
            <p
              class="
                text-2xl
                md:text-4xl
                leading-8
                text-cyan-50
                mb-8
                aos-init aos-animate
              "
              data-aos="zoom-y-out"
              data-aos-delay="150"
            ></p>
          </div>

          <img
            class="glow mt-8 sm:mt-16 rounded-lg"
            src="@/assets/img/screenshot.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <Features />
    <!-- <Cta /> -->
  </div>
</template>

<style scoped>
.glow {
  box-shadow: 0 0 20px #2f7083;
}
</style>
