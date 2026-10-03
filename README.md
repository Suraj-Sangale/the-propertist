# The Propertist | Luxury Real Estate & Verified Properties Portal

A Modern, and fully responsive real estate web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed for seamless property discovery, robust filtering, and instant developer inquiries.

---

##  Key Features & Requirements Met

### 1. Property Listings & Rich Cards
- Displays curated property cards with high-resolution image galleries, property title, pricing, location tag, and BHK configurations.
- Dynamic pricing logic supporting both **Buy** (capital value) and **Rent** (monthly rental value).
- Verified RERA and developer trust badges on each card.

### 2. Fast Debounced Search
- Real-time search bar with intelligent **debounce optimization** to filter properties smoothly as the user types without unnecessary re-renders.
- Multi-field matching across project title, developer, locality, city, and configurations.

### 3. Advanced Filtering & Mode Toggle
- **Buy / Rent Toggle**: Instantly switch modes with synchronized query params.
- **BHK Filters**: Multi-select support for 1 BHK, 2 BHK, 3 BHK, 4 BHK, and Penthouses.
- **Locality & Developer Filters**: Granular filtering by prime micro-markets (Bandra West, Andheri West, Powai, etc.) and leading developers (Kalpataru, Godrej, Oberoi, Lodha).
- **URL Query Sync**: Shareable filter state synchronized directly with browser history.

### 4. Property Detail Page
- Deep-dive property details page accessible on card click (`/property/[slug]`).
- Includes interactive image galleries, pricing sheets, floor plan previews, project amenities, location maps, developer background, and buyer reviews.
- **Live VIP Enquiry Form**: Integrated with Next.js API Routes and Nodemailer to automatically dispatch branded luxury confirmation emails to both client and sales admin.

### 5. Skeleton Loader State
- Polished skeleton loader cards during initial data fetch and filter transitions to ensure optimal perceived performance.

### 6. Mobile Responsive & Modern Theme
- 100% responsive across mobile, tablet, and desktop viewports.
- Mobile bottom-sheet drawers for filters and sort options.
- Dark luxury obsidian and gold-accented styling with custom micro-animations.
- Dedicated custom **404 Not Found** page (`/not-found`).

### 7. Wishlist / Shortlist System
- Persistent local storage wishlist allowing users to save and manage favorite properties across all pages with a real-time badge count (`/saved`).

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Modern Custom CSS Modules
- **Data Source**: Structured Mock JSON Dataset (`utilities/masterData.js`)
- **Icons**: Lucide React
- **Email Service**: Nodemailer API Route (`app/api/enquiry`)

---

## Getting Started

### Prerequisites
- Node.js 18.x or later installed
- npm or yarn or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Suraj-Sangale/the-propertist.git
   cd the-propertist
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional for email notifications):**
   ```Contact to me on +91 703 95 29 129  ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:5000](http://localhost:5000) (or default port 3000) to view the application.

---

## 📁 Project Structure

```
├── app/
│   ├── api/enquiry/        # Nodemailer API route for property leads
│   ├── listings/           # Search and listing page route
│   ├── property/[slug]/    # Dynamic property detail page
│   ├── saved/              # Wishlist / saved properties page
│   ├── not-found.tsx       # Custom luxury 404 page
│   ├── layout.tsx          # Root layout with Header and Footer
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── Header.tsx          # Navigation header with mega-dropdowns
│   ├── Footer.tsx          # Luxury footer with working options
│   ├── HomeSpace.tsx       # Homepage hero and category cards
│   ├── ListingsPage.tsx    # Property listing, debounced search & filters
│   └── PropertyCarousel.tsx# Featured properties carousel
└── utilities/
    ├── masterData.js       # Mock property dataset
    └── wishlist.ts         # LocalStorage wishlist hook
```
