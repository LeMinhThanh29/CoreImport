import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const initialState = {
  listFileImports: [],
  fileStatus: [],
  fileDetail: {},
  statusProgess: 0,
  columnsFileImports: [
    {
      column_name_desc: "Trạng Thái",
      column_name: "status_text",
    },
  ],
  dataSource: [],
  dataAfterParse: [],
};

export const ImportFileSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    getAllFileimport(state, action) {
      state.listFileImports = action.payload;
    },
    getFileStatus(state, action) {
      state.fileStatus = action.payload;
    },
    getFileDetails(state, action) {
      state.fileDetail = action.payload;
    },
    getStatus(state, action) {
      state.statusProgess = action.payload;
    },
    UpdateStatus(state, action) {
      state.statusProgess = action.payload;
    },
    removeFile(state, action) {
      const currentId = action.payload;
      state.listFileImports = state.listFileImports.filter(
        (file) => file.import_id !== currentId
      );
    },
    importAFile: (state, action) => {
      state.listFileImports = [...state.listFileImports, action.payload];
    },
    detailFileColumn: (state, action) => {
      state.columnsFileImports = [...state.columnsFileImports, action.payload];
    },
    RefeshetailFileColumn: (state, action) => {
      state.columnsFileImports = action.payload;
    },
    getValueData: (state, action) => {
      
      return {
        ...state,
        dataAfterParse: action.payload.map((item) =>
          item.NGAYNHAN !== undefined
            ? {
                ...item,
                NGAYNHAN: moment(item.NGAYNHAN, "YYYY-MM-DD")
                  .toDate()
                  .toString(),
              }
            : item
        ),
      };
    },
  },
});

export const {
  getAllFileimport,
  getFileStatus,
  getFileDetails,
  getStatus,
  UpdateStatus,
  removeFile,
  importAFile,
  detailFileColumn,
  RefeshetailFileColumn,
  getValueData,
} = ImportFileSlice.actions;
export default ImportFileSlice.reducer;
