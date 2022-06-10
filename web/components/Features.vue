<template>
  <div class="py-16 bg-gray-100 overflow-hidden lg:py-24">
    <div class="relative max-w-xl mx-auto px-4 sm:px-8 lg:max-w-7xl">
      <div class="relative" data-aos="zoom-y-out" data-aos-delay="150">
        <h2
          class="
            text-center text-3xl
            leading-8
            font-extrabold
            tracking-tight
            text-gray-900
            sm:text-4xl
          "
        >
          A delightful way to navigate the web
        </h2>
        <p class="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
          Navigate through web pages, chrome tabs, and bookmarks with just your
          keyboard. Simply open the command palette with a keyboard shortcut and
          start typing.
        </p>
      </div>

      <div
        class="
          relative
          mt-12
          lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center
        "
      >
        <div class="relative mx-8 sm:mx-12">
          <h3
            class="
              text-2xl
              font-extrabold
              text-gray-900
              tracking-tight
              sm:text-3xl
            "
          >
            Any link on the webpage is a few keystrokes away!
          </h3>
          <p class="mt-3 text-lg text-gray-500">
            Simply open the command palette and start typing.
          </p>
        </div>

        <div class="mt-10 relative lg:mt-0" aria-hidden="true">
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/screenshot.png"
            alt=""
          />
        </div>
      </div>

      <div class="relative mt-12 sm:mt-16 lg:mt-24">
        <div
          class="
            lg:grid
            lg:grid-flow-row-dense
            lg:grid-cols-2
            lg:gap-8
            lg:items-center
          "
        >
          <div class="lg:col-start-2 mx-8 sm:mx-12">
            <h3
              class="
                text-2xl
                font-extrabold
                text-gray-900
                tracking-tight
                sm:text-3xl
              "
            >
              Switch between tabs
            </h3>

            <dl class="mt-10 space-y-10">
              <div>
                <dd class="mt-2 text-base text-gray-500">
                  Now you can have as many tabs open as you wish without having
                  to worry about how to keep track of them.
                </dd>
                <dd class="mt-2 text-base text-gray-500">
                  Have too many windows open and not sure which window you need
                  to get to? Single Dispatch will search through all open
                  windows and focus on the tab you want.
                </dd>
              </div>
            </dl>
          </div>

          <div class="mt-10 relative lg:mt-0 lg:col-start-1">
            <img
              class="relative mx-auto rounded-lg glow"
              src="@/assets/img/screenshot.png"
              alt=""
            />
          </div>
        </div>
      </div>

      <div
        class="
          relative
          mt-12
          lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center
        "
      >
        <div class="relative mx-8 sm:mx-12">
          <h3
            class="
              text-2xl
              font-extrabold
              text-gray-900
              tracking-tight
              sm:text-3xl
            "
          >
            Target input fields or buttons directly.
          </h3>
          <p class="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            No need to tab through the entire page.
          </p>
        </div>

        <div class="mt-10 relative lg:mt-0" aria-hidden="true">
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/screenshot.png"
            alt=""
          />
        </div>
      </div>

      <div class="relative mt-12 sm:mt-16 lg:mt-24">
        <div
          class="
            lg:grid
            lg:grid-flow-row-dense
            lg:grid-cols-2
            lg:gap-8
            lg:items-center
          "
        >
          <div class="lg:col-start-2 mx-8 sm:mx-12">
            <h3
              class="
                text-2xl
                font-extrabold
                text-gray-900
                tracking-tight
                sm:text-3xl
              "
            >
              Open bookmarks and frequently visited sites
            </h3>
          </div>

          <div class="mt-10 relative lg:mt-0 lg:col-start-1">
            <img
              class="relative mx-auto rounded-lg glow"
              src="@/assets/img/screenshot.png"
              alt=""
            />
          </div>
        </div>
      </div>

      <div
        class="
          relative
          mt-12
          lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center
        "
      >
        <div class="relative mx-8 sm:mx-12">
          <h3
            class="
              text-2xl
              font-extrabold
              text-gray-900
              tracking-tight
              sm:text-3xl
            "
          >
            Quickly triage emails or tickets with shortcuts
          </h3>
        </div>

        <div class="mt-10 relative lg:mt-0" aria-hidden="true">
          <img
            class="relative mx-auto rounded-lg glow"
            src="@/assets/img/screenshot.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <!-- Search through docs and get to answers quickly -->
  </div>
</template>


<style scoped>
.glow {
  box-shadow: 5px 5px 10px #2f7083;
}
</style>