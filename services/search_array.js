function getObject(array, key, value) {
  return array.filter((object) => {
    return object[key] == value;
  });
}

exports.getObject = getObject;
