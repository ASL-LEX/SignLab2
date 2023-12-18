export default () => ({
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/signlab'
  },
  gcp: {
    storage: {
      keyFilename: process.env.GCP_KEY_FILENAME,
      bucket: process.env.GCP_STORAGE_BUCKET || 'signlab-dev'
    }
  },
  upload: {
    prefix: process.env.GCP_STORAGE_PREFIX || 'uploads',
    csvFileName: process.env.GCP_STORAGE_CSV_FILENAME || 'data.csv',
    entryFolder: process.env.GCP_STORAGE_ENTRY_FOLDER || 'entries'
  },
  dataset: {
    prefix: process.env.GCP_STORAGE_DATASET_PREFIX || 'datasets'
  }
});
