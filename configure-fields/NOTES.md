## TODOs

- if the field to which this add-on is applied is localized, throw an error: it should never be a localized field
- update the /docs/ resources with new images/gifs/movies
- ensure all the package metadata is correct

## Test Settings

```json
{
  "global": [
    {
      "id": "developmentMode",
      "label": "Development mode?",
      "type": "boolean",
      "hint": "Enable development logs on the console"
    }
  ],
  "instance": [
    {
      "id": "hiddenFields",
      "label": "Fields that will be hidden based on this field's value",
      "type": "json",
      "required": true,
      "hint": "For each allowed value of this field, add a parameter to this JSON containing an array of field API keys to be hidden"
    }
  ]
}
```
```json
{
  "alpha": ["field_a", "field_b"],
  "beta": ["field_b", "field_d"],
  "gamma": ["field_a", "field_c"]
}

```
