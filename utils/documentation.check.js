const checkDocuments = (user) => {

  const requiredDocuments = ["ID.pdf", "proof of residence.pdf", "account statement.pdf"];
  const userDocumentNames = user.documents.map(doc => doc.name);
  return requiredDocuments.every(reqDoc => userDocumentNames.includes(reqDoc));
};

export default checkDocuments;