# Lab & Class Management System

A comprehensive web application for managing laboratories, classes, and student attendance efficiently.

## Features

- **Lab Management**: Create, edit, and manage laboratory sessions
- **Class Management**: Schedule and track class sessions
- **Attendance Tracking**: Monitor attendance for both labs and classes
- **Data Visualization**: Charts and analytics for better insights
- **Import/Export**: Excel file support for data management
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Charts**: Chart.js
- **Data Storage**: Local Storage (client-side)
- **Excel Support**: SheetJS

## Local Development

1. Clone or download this repository
2. Install Node.js (if not already installed)
3. Install http-server globally:
   ```bash
   npm install -g http-server
   ```
4. Run the development server:
   ```bash
   http-server -p 8000
   ```
5. Open your browser and navigate to `http://localhost:8000`

## Deployment

### GitHub Pages
1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Select source as "Deploy from a branch"
4. Choose main branch and root folder
5. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Push this repository to GitHub
2. Sign up for Netlify and connect your GitHub account
3. Select this repository
4. Build settings: Not needed (static site)
5. Deploy!

### Vercel
1. Push this repository to GitHub
2. Sign up for Vercel and import your project
3. Vercel will automatically detect it's a static site
4. Deploy with one click

## Usage

1. **Dashboard**: View overview of labs and classes
2. **Lab Management**: Add/edit labs and track attendance
3. **Class Management**: Schedule classes and monitor attendance
4. **Reports**: Export data to Excel for further analysis
5. **Settings**: Import existing data from Excel files

## Data Persistence

The application uses browser's local storage to save data. All data is stored locally on the user's device and persists between sessions.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.
