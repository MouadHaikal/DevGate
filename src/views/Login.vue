<template>
    <div 
        :class="['w-[30rem] h-[35rem] mx-auto mt-20 bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-gray-950 outline-2 outline-offset-8',
               'outline-dashed outline-gray-700 border border-gray-700 hover:bg-gray-950/5 hover:border-gray-600 hover:outline-gray-600',
               'transition duration-400 hover:shadow-lg',
               'flex justify-center items-center flex-col relative',
        ]"
    >
        <transition name="fade">
            <div
                v-if="isLoading"
                class="absolute inset-0 z-50 h-full w-full bg-gray-800/50 rounded-2xl backdrop-blur-xs flex items-center justify-center"
            >
                <div class="loader"></div>
            </div>
        </transition>


        <div class="mx-auto text-4xl font-bold text-violet-400 font-winky mb-10 select-none underline decoration-violet-300 underline-offset-4 decoration-dashed">
            Log In
        </div>

        <form class="w-5/6 mx-auto" @submit.prevent="handleSubmission">
            <div class="relative z-0 w-full mb-5 group">
                <input type="email" name="floating_email" id="floating_email" 
                    class="block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none text-gray-200 
                         border-gray-600 focus:border-violet-400 focus:outline-none focus:ring-0 peer" 
                    placeholder=" " required 
                    v-model="email"
                />

                <label for="floating_email" 
                    class="peer-focus:font-medium absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
                    origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-400 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Email address
                </label>
            </div>

            <div class="relative z-0 w-full mb-5 group">
                <input type="password" name="floating_password" id="floating_password"
                    class="block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none text-gray-200 
                         border-gray-600 focus:border-violet-400 focus:outline-none focus:ring-0 peer" 
                    placeholder=" " required 
                    v-model="password"
                />

                <label for="floating_password" 
                    class="peer-focus:font-medium absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 
                    origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-400 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Password
                </label>
            </div>

            <div class="mb-5 mt-7 flex justify-between items-center">
                <div>
                    <input id="check" name="check" type="checkbox">

                    <label for="check" class="text-gray-400 font-bold ml-1 select-none text-sm">
                        Remember me
                    </label>
                </div>

                <div class="cursor-pointer text-gray-400 hover:text-gray-300 text-sm font-bold">
                    Forgot Password?
                </div>
            </div>

            <div class="w-full flex justify-center mt-10">
                <button type="submit" class="fancyButton fancyButton-purple">
                    Log in
                </button>
            </div>

            <div class="w-full flex justify-center mt-6 mb-8 text-gray-400 text-sm font-bold">
                <router-link :to="{ name:'Signup' }" class="cursor-pointer hover:text-gray-300">
                    I don't have an account
                </router-link>
            </div>

            <hr class="fancy-hr">

            <div class="w-full flex justify-center mt-6">
                <button type="button" class="fancyButton fancyButton-orange flex items-center" @click.prevent="handleGoogleSignIn">
                    <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>

                    <span>Continue with Google</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    import { signInWithEmailAndPassword } from 'firebase/auth'
    import { auth } from '../composables/useFirestore';
    import { signInWithGoogle } from "../composables/useAuth.js";

    import { useNotification } from '../composables/useNotification';
    const { showNotification } = useNotification();


    const isLoading = ref(false);

    const email    = ref("");
    const password = ref("");


    async function handleSubmission() {
        isLoading.value = true;

        try{
            await signInWithEmailAndPassword(auth, email.value, password.value);

            showNotification("Successfully logged in", 'success');
            router.push({ name:'Explore' });

        } catch (error){
            const errorCode = error.code

            switch (errorCode) {
                case 'auth/invalid-credential':
                    showNotification("Invalid credentials", 'error');
                    break
                default:
                    showNotification("Login failed. Try again", 'error');
            }

        } finally{
            isLoading.value = false;
        }
    }

    async function handleGoogleSignIn() {
        isLoading.value = true;

        try {
            const { user, error: googleError } = await signInWithGoogle();

            if (googleError) {
                throw new Error(googleError.message || "Authentification failed usinig Google");
            }

            if (user) {
                showNotification("Successfully logged in", 'success');
                router.push({ name:'Explore' });
            }
        } catch (err) {
            showNotification("Login failed. Try again", 'error');
            console.error("Failed to sign in with Google:", err);
        } finally{
            isLoading.value = false;
        }
    }
</script>
