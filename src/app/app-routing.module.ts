import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    title: 'Welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
  {
    path: 'login',
    title: 'Login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    title: 'Home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'new-user',
    title: 'New User',
    loadChildren: () =>
      import('./pages/new-user/new-user.module').then(
        (m) => m.NewUserPageModule
      ),
  },
  {
    path: 'new-score',
    title: 'New Score',
    loadChildren: () =>
      import('./pages/new-score/new-score.module').then(
        (m) => m.NewScorePageModule
      ),
  },
  {
    path: 'register',
    title: 'Register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'verify-email',
    title: 'Verify Email',
    loadChildren: () =>
      import('./pages/verify-email/verify-email.module').then(
        (m) => m.VerifyEmailPageModule
      ),
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  // {
  //   path: 'community',
  //   loadChildren: () => import('./pages/community/community.module').then(m => m.CommunityPageModule)
  // },
  // {
  //   path: 'ranking-detail',
  //   loadChildren: () => import('./pages/ranking-detail/ranking-detail.module').then(m => m.RankingDetailPageModule)
  // },
  {
    path: 'onboarding',
    title: 'Onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  // {
  //   path: 'skill-detail',
  //   loadChildren: () => import('./pages/skill-detail/skill-detail.module').then( m => m.SkillDetailPageModule)
  // },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // enableTracing: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
