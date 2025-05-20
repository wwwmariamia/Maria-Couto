<script setup>
import { ref, onMounted } from 'vue';
const router = useRouter();

const homepageSettings = ref(null); // For homepage.json data
const generalSettings = ref(null); // For settings.json data

const isLoading = ref(true); // Loading state
const hasError = ref(false); // Error state

// For typewriter effect
const displayedTitle = ref(""); // Title animation
const displayedSubtitle = ref(""); // Subtitle animation
const displayedCopyright = ref(""); // Copyright animation
const typingSpeed = 20; // Speed of typewriter effect

const animateTypewriter = (text, refToUpdate, callback = null) => {
  let index = 0;

  const type = () => {
    if (index < text.length) {
      refToUpdate.value += text.charAt(index);
      index++;
      setTimeout(type, typingSpeed);
    } else if (callback) {
      callback();
    }
  };

  type();
};

onMounted(async () => {
  try {
    // Fetch homepage.json
    const homepageResponse = await fetch('/_data/homepage.json');
    if (!homepageResponse.ok) {
      throw new Error(`Homepage settings error! status: ${homepageResponse.status}`);
    }
    const homepageData = await homepageResponse.json();
    homepageSettings.value = homepageData;

    // Fetch settings.json
    const settingsResponse = await fetch('/_data/settings.json');
    if (!settingsResponse.ok) {
      throw new Error(`General settings error! status: ${settingsResponse.status}`);
    }
    generalSettings.value = await settingsResponse.json();

    

    if (homepageSettings.value.homepageredirect ==""){
      // console.log('no')
      // Start typewriter effect when general settings are loaded
    animateTypewriter(generalSettings.value.site_title || "", displayedTitle, () => {
      animateTypewriter(generalSettings.value.site_subtitle || "", displayedSubtitle, () => {
        const copyrightText = (generalSettings.value.copyright);
        animateTypewriter(copyrightText, displayedCopyright);
      });
    });
    }
    else {
      // console.log('yes')
      // Redirect if homepageredirect is set
      if (homepageSettings.value.homepageredirect) {
          const redirectPath = homepageSettings.value.homepageredirect
            ? `/page/${homepageSettings.value.homepageredirect}`
            : null;

          if (redirectPath) {
            router.push(redirectPath);
          }
        }
    }

   

    isLoading.value = false; // Stop loading when both files are fetched
  } catch (error) {
    hasError.value = true; // Show error message if fetching fails
    console.error('Error loading settings:', error);
  }
});
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="flex items-center justify-center h-screen">
      <p>Error loading settings. Please try again later.</p>
    </div>

    <!-- Main content -->
    <div v-else class="h-screen relative">
      <!-- Background container -->
      <div class="relative h-full">
        <!-- Background image -->
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: homepageSettings?.thumbnail ? `url(${homepageSettings.thumbnail})` : '' }"
        ></div>

        <!-- Black overlay for opacity -->
        <div class="absolute inset-0 bg-black opacity-30"></div>

        <!-- Content above the background -->
        <div class="relative z-10 pr-5">
          <Drawer />
        </div>

        <!-- Info section with typewriter effect -->
        <div class="info flex flex-col items-center justify-center h-screen relative">
          <div class="container text-left p-1 lg:p-20">
            <div
              class="container opacity-80 animate-fade animate-once animate-delay-[100ms] text-white"
            >
              <!-- Title -->
              <div class="relative">
                <div class="blur-text text-6xl font-bold">{{ displayedTitle }}</div>
                <div class="text-6xl font-bold border-r-4 border-white pr-2 animate-blink">
                  {{ displayedTitle }}
                </div>
              </div>

              <!-- Subtitle -->
              <div class="relative mt-4">
                <div class="blur-text text-2xl font-semibold">{{ displayedSubtitle }}</div>
                <div class="text-2xl font-semibold">{{ displayedSubtitle }}</div>
              </div>

              <!-- Copyright -->
              <div class="relative mt-4">
                <div class="blur-text font-light">{{ displayedCopyright }}</div>
                <div class="font-light">{{ displayedCopyright }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
@keyframes blink {
  0%, 100% {
    border-color: transparent;
  }
  50% {
    border-color: white;
  }
}

.animate-blink {
  animation: blink 0.7s step-end infinite;
}

/* Blurred text styling */
.blur-text {
  position: absolute; /* Place the blurred text behind the original */
  top: 0;
  left: 0;
  color: black; /* Black text for contrast */
  opacity: 0.4; /* Adjust for a subtle blur */
  filter: blur(8px); /* Apply Gaussian blur */
  z-index: -1; /* Ensure it's below the main text */
}
</style>
