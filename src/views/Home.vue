<template>
    <section class="w-full h-[70rem] mx-auto fade-edge pt-20">
        <div class="w-3/4 mx-auto text-center text-gray-100 flex flex-col justify-evenly gap-13 py-20">
            <div class="">
                <span class="text-5xl font-light text-gray-300 font-winky">Introducing </span> 
                <span class="text-5xl font-quizano font-bold text-violet-400">DevGate</span> 

                <br><br>

                <div class="text-6xl mx-auto font-winky text-amber-100 max-w-[25ch]">" Honestly, I can't find a better quiz website out there. "</div> 

                <div class="flex justify-center items-center w-full mt-8">
                    <div class="shrink-0">
                        <img class="size-8 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Avatar">
                    </div>
                    <div class="ms-4">
                        <div class="text-base font-semibold text-gray-300">Josh Graziano</div>
                        <div class="text-xs text-gray-400">Nice guy</div>
                    </div>
                </div>
            </div>

            <hr class="bg-gray-600 border-none h-[1px] w-3/4 mx-auto">

            <div class="flex flex-col justify-between gap-9 items-center">
                <div class="text-xl max-w-[60ch]">
                    Challenge yourself with <span class="font-bold text-violet-300">fun and engaging</span> quizzes across hundreds of topics
                    or unleash your creativity by <span class="font-bold text-orange-200">building your own </span>quizzes!
                </div>

                <div class="flex justify-between items-center gap-12 mt-4">
                    <router-link :to="{ name: loggedIn? 'Explore' : 'Signup' }" class="fancyButton fancyButton-purple flex items-center">
                        
                        {{ loggedIn?'Explore &nbsp;&nbsp;›':'Sign up for free &nbsp;&nbsp;›' }}
                    </router-link>

                    <a href="#cards" class="fancyButton fancyButton-orange flex items-center">
                        Learn more &nbsp;&nbsp;›
                    </a>
                </div>
            </div>
        </div>

        <div id="cards" class="overflow-clip pointer-none marquee-container">
            <div class="marquee text-amber-50 text-lg mt-28 h-20  flex items-center gap-20">
                <img class="logo" src="../assets/logos/Broni-Gent.png" alt="Broni-Gent">
                <img class="logo" src="../assets/logos/Gorbaningo.png" alt="Gorbaningo">
                <img class="logo" src="../assets/logos/Malany.png" alt="Malany">
                <img class="logo" src="../assets/logos/NAKONI.png" alt="NAKONI">
                <img class="logo" src="../assets/logos/Obasni.png" alt="Obasni">
                <img class="logo" src="../assets/logos/Saranyo.png" alt="Saranyo">
                <img class="logo" src="../assets/logos/Stolayter.png" alt="Stolayter">
                <img class="logo" src="../assets/logos/Hlohalo.png" alt="Hlohalo">


                <img class="logo" src="../assets/logos/Broni-Gent.png" alt="Broni-Gent">
                <img class="logo" src="../assets/logos/Gorbaningo.png" alt="Gorbaningo">
                <img class="logo" src="../assets/logos/Malany.png" alt="Malany">
                <img class="logo" src="../assets/logos/NAKONI.png" alt="NAKONI">
                <img class="logo" src="../assets/logos/Obasni.png" alt="Obasni">
                <img class="logo" src="../assets/logos/Saranyo.png" alt="Saranyo">
                <img class="logo" src="../assets/logos/Stolayter.png" alt="Stolayter">
                <img class="logo" src="../assets/logos/Hlohalo.png" alt="Hlohalo">

                <img class="logo" src="../assets/logos/Broni-Gent.png" alt="Broni-Gent">
                <img class="logo" src="../assets/logos/Gorbaningo.png" alt="Gorbaningo">
                <img class="logo" src="../assets/logos/Malany.png" alt="Malany">
                <img class="logo" src="../assets/logos/NAKONI.png" alt="NAKONI">
                <img class="logo" src="../assets/logos/Obasni.png" alt="Obasni">
                <img class="logo" src="../assets/logos/Saranyo.png" alt="Saranyo">
                <img class="logo" src="../assets/logos/Stolayter.png" alt="Stolayter">
                <img class="logo" src="../assets/logos/Hlohalo.png" alt="Hlohalo">
            </div>
        </div>
    </section>

    <section class="w-[68rem] h-[28rem] mx-auto flex justify-between items-center">
        <div class="card hover:shadow-purple-500" @mousemove="handleMouseMove">
            <div class="card-content">
                <div class="w-full h-40 mt-8">
                    <div class="size-40 m-auto rounded-full bg-gray-800/40 shadow-2xl shadow-gray-950 flex justify-center items-center">
                        <div class="size-30 rounded-full bg-gray-800/30 shadow-2xl shadow-gray-950 flex justify-center items-center relative">

                            <div class="absolute size-18  bg-gradient-to-tr from-pink-600/60 to-purple-600/60 rounded-full blur-lg"></div>

                            <div class="size-18 rounded-full bg-gray-800/80 flex justify-center items-center relative">
                                <svg class='size-9 text-pink-100' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="w-full mx-auto mt-10 flex flex-col items-center gap-5 text-center">
                    <div class="fancy-title bg-gradient-to-r from-violet-400 to-purple-400">
                        Quizzes For Days
                    </div>

                    <hr class="fancy-hr">

                    <div class="desc">
                        Dive into our massive collection of brain-bending quizzes spanning every topic imaginable
                    </div>
                </div>
            </div>
        </div>

        <div class="card hover:shadow-teal-500" @mousemove="handleMouseMove">
            <div class="card-content">
                <div class="w-full h-40 mt-8">
                    <div class="size-40 m-auto rounded-full bg-gray-800/40 shadow-2xl shadow-gray-950 flex justify-center items-center">
                        <div class="size-30 rounded-full bg-gray-800/30 shadow-2xl shadow-gray-950 flex justify-center items-center relative">

                            <div class="absolute size-18  bg-gradient-to-tr from-teal-600/60 to-lime-600/60 rounded-full blur-lg"></div>

                            <div class="size-18 rounded-full bg-gray-800/80 flex justify-center items-center relative">
                                <svg class="size-9 text-teal-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full mx-auto mt-10 flex flex-col items-center gap-5 text-center">
                    <div class="fancy-title bg-gradient-to-r from-teal-400 to-green-400">
                        Puzzle Masters
                    </div>

                    <hr class="fancy-hr">

                    <div class="desc">
                        Challenge yourself with mind-twisting puzzles designed to test your logic and creativity
                    </div>
                </div>
            </div>
        </div>

        <div class="card hover:shadow-orange-500" @mousemove="handleMouseMove">
            <div class="card-content">
                <div class="w-full h-40 mt-8">
                    <div class="size-40 m-auto rounded-full bg-gray-800/40 shadow-2xl shadow-gray-950 flex justify-center items-center">
                        <div class="size-30 rounded-full bg-gray-800/30 shadow-2xl shadow-gray-950 flex justify-center items-center relative">

                            <div class="absolute size-18  bg-gradient-to-tr from-amber-600/60 to-orange-600/60 rounded-full blur-lg"></div>

                            <div class="size-18 rounded-full bg-gray-800/80 flex justify-center items-center relative">
                                <svg class="size-9 text-orange-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full mx-auto mt-10 flex flex-col items-center gap-5 text-center">
                    <div class="fancy-title bg-gradient-to-r from-orange-400 to-amber-400">
                        Streak Champion
                    </div>

                    <hr class="fancy-hr">

                    <div class="desc">
                        Compete daily, build your winning streak, and watch your name climb our leaderboards
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="w-full h-[50rem] mt-12 fade-footer relative">
        <div class="footer-pattern"></div>
        
        <div class="w-full h-full absolute top-0 z-10 flex flex-col items-center justify-between">
            <div class="w-full flex justify-center gap-8 items-start pt-64">
                <div class="w-[22rem] pt-10 select-none">
                    <div class="font-quizano font-bold text-[2rem] text-violet-400 mb-3">
                        Quizano
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="text-gray-400 font-bold text-lg mt-5 leading-6">
                        Challenge Your Mind,<br> 
                        Expand Your World
                    </div>
                </div>


                <div class="w-[20rem] text-lg text-gray-400 select-none">
                    <div class="text-3xl text-gray-300">
                        Quick links
                    </div>
                    <hr class="w-[2.5rem] border-none h-[2px] bg-violet-400 mt-3">

                    <div class="mt-6 mb-3 hover:text-gray-200 cursor-pointer">
                        Terms & Conditions 
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3 hover:text-gray-200 cursor-pointer">
                        About Licenses
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3 hover:text-gray-200 cursor-pointer">
                        Help & Support
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3 hover:text-gray-200 cursor-pointer">
                        Careers
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3 hover:text-gray-200 cursor-pointer">
                        Privacy Policy
                    </div>
                </div>


                <div class="w-[22rem] text-lg text-gray-400">
                    <div class="text-3xl text-gray-300 select-none">
                        Contact
                    </div>
                    <hr class="w-[2.5rem] border-none h-[2px] bg-violet-400 mt-3">

                    <div class="mt-6 mb-3">
                        Lot 660, Hay Moulay Rachid Ben Guerir, 43150, Morocco 
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3">
                        +212 522 014 709
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3">
                        contact@quizano.ma
                    </div>

                    <hr class="fancy-hr-l">

                    <div class="my-3 text-sm">
                        I have read and accept the general 
                        <span class="font-bold text-gray-300 cursor-pointer">terms and conditions</span> 
                        of use, in particular the statement concerning the protection of 
                        <span class="font-bold text-gray-300 cursor-pointer">personal data</span>.
                    </div>
                </div>
            </div>

            <div class="w-full h-36 text-center select-none">
                <hr class="fancy-hr">

                <div class="font-bold text-gray-200 mt-6">
                    Copyright © 2025 Quizano. &nbsp;&nbsp;All Rights Reserved.
                    <br>
                    <span class="font-normal text-gray-300">Privacy Policy &nbsp;&nbsp;| &nbsp;&nbsp;Terms of Use &nbsp;&nbsp;| &nbsp;&nbsp;Contact Us</span>
                </div>

                <div class="text-gray-400 text-xs mt-3">
                    Quizano and the Quizano logo are trademarks of Quizano. Unauthorized use or reproduction of 
                    <br>
                    our content, quizzes, or branding is prohibited without written permission.
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    import { computed } from 'vue';

    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;

        const rect = target.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    }

    import { useUser } from '../composables/useUser'
    const { currentUser, isUserInitialized } = useUser();

    const loggedIn = computed(() => {return isUserInitialized && currentUser.value!=null});
</script>

<style scoped>
    .fade-edge {
        background: linear-gradient(to bottom, rgba(16, 24, 40, 0) 0%, rgba(16, 24, 40, 1) 10%, rgba(16, 24, 40, 1) 70%, rgba(16, 24, 40, 0) 100%);
    }

    .logo{
        object-fit: contain;
        height: 1.4rem;
    }

    .marquee-container{
        mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) 10%,
            rgba(0, 0, 0, 1) 90%,
            rgba(0, 0, 0, 0)
        );
    }

    @keyframes marquee-move-text {
        to {
            transform: translateX(-100rem);
        }
    }

    .marquee{
        animation: marquee-move-text 15s linear infinite;
    }

    .fade-footer{
        background: linear-gradient(to bottom, rgba(16, 24, 40, 0) 0%, rgba(16, 24, 40, 1) 30%, rgba(16, 24, 40, 1) 40%, oklch(13% 0.028 261.692) 100%);
    }

    .footer-pattern{
        height: 100%;
        width: 100%;
        position: relative;

        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");

        mask-image: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.5),
            rgba(0, 0, 0, 0.7) 20%,
            rgba(0, 0, 0, 0) 80%,
            rgba(0, 0, 0, 0)
        );
    }
</style>
