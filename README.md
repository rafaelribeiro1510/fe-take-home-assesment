# Field Support for Batteries

## Instructions

Fork this repository.

The exercise requirements and test cases are provided in the Word document you received.

Use the provided data file at data/battery.json as your data source.

## Good luck!

---

## Rafael Ribeiro's Fork

### Added Dependencies
- Added `vuetify` UI component library
- Added `vitest` and `@vue/test-utils pinia` testing libraries

### Running the App
1. Install all dependencies `npm i` 
2. Start development Vite server `npm run dev`
3. See website at [localhost:5173](http://localhost:5173/)
4. Run the unit tests `npm run test`

### UI
My solution consists of a view `BatteryStatus`, where schools are listed as expandable panels, within which is a data table of devices and their battery status. Each row of this table consists of the device's serial number and the calculated battery's average daily usage, which is color coded to improve readability (here I assumed the colors red, orange, green and grey for battery health $x$, respectively, $x\geq30$, $30>x\geq25$, $x<25$, and $x=$ unknown).

All information required by the problem statement can be seem at a glance, and with minimal, intuitive interaction.

### Assumptions
All intervals are equally weighted, as in, only total spent battery and total past time is accounted for each device's calculations. Other weighing mechanisms were considered, such as considering "work hours" where devices would be on load vs "off" hours, where devices would be idle; but due to time constraints, this could not be implemented and fully tested.