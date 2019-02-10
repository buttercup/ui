import PropTypes from 'prop-types';

function UUIDValue(props, propName, componentName) {
  if (!/^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/.test(props[propName])) {
    return new Error(
      `Invalid prop '${propName}' supplied to '${componentName}. Validation failed.'`
    );
  }
}

export const EntryFacadeField = PropTypes.shape({
  title: PropTypes.string.isRequired,
  field: PropTypes.oneOf(['property', 'attribute']),
  property: PropTypes.string.isRequired,
  value: PropTypes.string,
  secret: PropTypes.bool,
  multiline: PropTypes.bool,
  formatting: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  maxLength: PropTypes.number
});
export const EntryFacade = PropTypes.shape({
  id: UUIDValue,
  type: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(EntryFacadeField),
  parentID: PropTypes.string.isRequired
});
export const GroupFacade = PropTypes.shape({
  id: UUIDValue,
  type: PropTypes.oneOf(['group']),
  title: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  parentID: PropTypes.string.isRequired
});
export const VaultFacade = PropTypes.shape({
  id: UUIDValue,
  type: PropTypes.oneOf(['archive']),
  attributes: PropTypes.object.isRequired,
  groups: PropTypes.arrayOf(GroupFacade),
  entries: PropTypes.arrayOf(EntryFacade)
});
