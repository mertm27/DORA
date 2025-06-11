# DORA Survey Application - Welcome Page

## Overview

The application now features a modern welcome landing page that introduces users to the DORA (Digital Operational Resilience Act) compliance survey. The welcome page serves as the entry point to the survey application and is **fully translated to Macedonian** to match the language used throughout the application.

## Page Features

### 🎨 Modern Design Elements

- **Animated background**: Floating blob animations with gradient effects
- **Hero section**: Large shield icon with EU regulation badge
- **Gradient typography**: Eye-catching titles with blue-to-purple gradients
- **Responsive layout**: Fully responsive design for all device sizes

### 📋 Content Sections (in Macedonian)

#### 1. Hero Section

- **ДОРА Прашалник за усогласеност** main title
- **Проценка на Законот за дигитална оперативна отпорност** subtitle
- Information about EU regulation effective January 17, 2025
- Institution type tags (Банки и финансиски институции, Осигурителни компании, Инвестициски фирми, ИКТ провајдери на услуги)

#### 2. Што покрива ДОРА? (What DORA Covers)

Six key areas of the DORA regulation:

- 🔒 **ИКТ Управување со ризици** - Принципи и барања за рамката на управување со ИКТ ризици
- 👥 **ИКТ Управување со ризици од трети страни** - Следење на провајдери на ризици од трети страни и клучни договорни одредби
- 🖥️ **Тестирање на дигиталната оперативна отпорност** - Основни и напредни барања за тестирање
- 📄 **ИКТ-поврзани инциденти** - Општи барања и пријавување на главни ИКТ-поврзани инциденти
- 🌐 **Споделување информации** - Размена на информации и разузнавање за кибер-закани
- ☁️ **Надзор над критични провајдери од трети страни** - Рамка за надзор на критични ИКТ провајдери од трети страни

#### 3. Процес на прашалникот (Survey Process)

Three-step process visualization:

1. **НДА Договор** - Прегледајте и прифатете го договорот за доверливост
2. **Информации за банката** - Обезбедете основни информации за вашата институција
3. **ДОРА Проценка** - Пополнете го прашалникот за дигитална оперативна отпорност

#### 4. Зошто е важна оваа проценка? (Why Assessment is Important)

- ЕУ усогласеност - Исполнете ги регулаторните барања
- Проценка на ризик - Идентификувајте ранливости
- Оперативна отпорност - Зајакнете ги дигиталните способности

#### 5. Footer

- Regulation details: Регулатива (ЕУ) 2022/2554 • Во сила од 17 јануари 2025 година
- Link to EIOPA ДОРА информации
- EU compliance badges in Macedonian

## Language Consistency

The welcome page is now **fully translated to Macedonian**, ensuring consistency with:

- ✅ Survey application interface
- ✅ Admin dashboard
- ✅ Questionnaire content
- ✅ NDA forms
- ✅ Notification messages

This provides a seamless user experience in Macedonian from start to finish.

## Routing Structure

```
/ - Welcome Page (default route)
/welcome - Welcome Page (alternative route)
/survey - Survey Application (NDA + Questionnaire)
/admin - Admin Dashboard
```

## Navigation Flow

```
Welcome Page → Start DORA Assessment → Survey App
     ↓              ↗
Admin Dashboard  ← Back to Home (Float Button)
```

## Technical Implementation

### Components Used

- **Ant Design**: Layout, Typography, Cards, Buttons, Steps
- **React Router**: Navigation between pages
- **Tailwind CSS**: Styling and responsive design
- **Custom CSS**: Blob animations and gradient effects

### Key Features

- **Responsive design**: Mobile-first approach
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Performance**: Optimized animations and lazy loading
- **SEO ready**: Proper heading structure and meta information

### Files Structure

```
src/
├── pages/
│   ├── welcome/
│   │   └── WelcomePage.tsx     # Main welcome page component
│   ├── survey/
│   │   └── SurveyApp.tsx       # Survey application (updated routing)
│   └── admin/
│       └── AdminDashboard.tsx  # Admin interface
├── App.tsx                     # Updated routing configuration
└── assets/
    └── global.css              # Animation styles
```

## Usage

### Starting the Application

1. Navigate to the root URL (`/`) or `/welcome`
2. Click "Start DORA Assessment" to begin the survey
3. Or click "Admin Dashboard" to access the admin interface

### Development

- **Development server**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Customization

### Styling

- Update colors in `src/assets/global.css`
- Modify Ant Design theme in `App.tsx`
- Adjust animations and transitions

### Content

- Update DORA areas in `WelcomePage.tsx`
- Modify survey steps description
- Change institution types and tags

### Navigation

- Add new routes in `App.tsx`
- Update navigation links in components
- Modify float button actions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive breakpoints: xs, sm, md, lg, xl

## Performance Notes

- Optimized animations using CSS transforms
- Lazy loading for large components
- Efficient re-renders with React optimization
- Minimal bundle size with tree shaking

## Future Enhancements

- Add multi-language support
- Implement user authentication
- Add progress persistence across sessions
- Enhanced accessibility features
- Dark mode support
