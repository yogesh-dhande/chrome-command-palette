<template>
  <div class="py-16 bg-gray-100 overflow-hidden lg:py-24">
    <div class="relative mx-auto px-4 sm:px-8 max-w-7xl">
      <div class="relative" data-aos="zoom-y-out" data-aos-delay="150">
        <h2
          class="
            text-3xl
            leading-8
            font-extrabold
            tracking-tight
            text-gray-900
            sm:text-4xl
          "
        >
          A delightful way to navigate the web
        </h2>
        <p class="mt-4 text-xl text-gray-500">
          Command palettes are not just for your code editor! Navigate through
          web pages, tabs or bookmarks with just your keyboard. Simply open the
          command palette with a keyboard shortcut and start typing.
        </p>
      </div>

      <FeatureItem>
        <template #header> Switch between tabs with ease </template>
        <template #description>
          <p>
            Now you can have as many tabs open as you wish without having to
            worry about how to keep track of them.
          </p>
          <p>
            Have too many windows open and not sure which window you need to get
            to? You can search through all open windows and switch to the tab
            you want.
          </p>
        </template>
        <template #image>
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/tabs.png"
            alt=""
        /></template>
      </FeatureItem>

      <FeatureItem>
        <template #header>Open bookmarks or frequently visited sites </template>
        <template #description
          >No need to worry about perfectly organizing your bookmarks into
          folders and subfolders when you can just search for them!</template
        >
        <template #image>
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/bookmarks.png"
            alt=""
        /></template>
      </FeatureItem>

      <FeatureItem>
        <template #header>
          Any link on the webpage is a few keystrokes away!
        </template>
        <template #description>
          Simply open the command palette and start typing. Search through docs
          and get to answers quickly.
        </template>
        <template #image>
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/docs.png"
            alt=""
        /></template>
      </FeatureItem>

      <FeatureItem>
        <template #header> Target input fields or buttons directly</template>
        <template #description>
          No need to use the mouse or tab through all elements on the page.
        </template>
        <template #image>
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/inputs.png"
            alt=""
        /></template>
      </FeatureItem>

      <FeatureItem>
        <template #header> Works with your favorite web apps </template>
        <template #description
          >Quickly triage issues on Github or emails on Gmail. Customizations
          for your favorite apps coming soon!</template
        >
        <template #image>
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/gmail.png"
            alt=""
        /></template>
      </FeatureItem>
      <img
        class="mt-12 relative mx-auto rounded-lg glow"
        src="@/assets/img/github.png"
        alt=""
      />
    </div>
  </div>
</template>


<style scoped>
.glow:hover {
  box-shadow: 5px 5px 10px #2f7083;
}
.glow {
  box-shadow: 10px 10px 20px #2f7083;
}
</style>