# esqlabs.handontable

> _Test package for the esqLABS_

`esqlabs.handontable` allows you to add interactive excel basis table . It is a wrapper for the `handsontable` library.

## How to install?

GitHub:

```r
remotes::install_github("esqLABS/esqlabs.handsontable")
```

Development mode:

To build the JS code, go to the RStudio terminal tab (or any terminal) and run at the package root:
```
yarn install
yarn run webpack --mode=development
```

To generate JS code, recompile with yarn run webpack, document and reload the package functions:
```r
devtools::document()
devtools::load_all()
```

