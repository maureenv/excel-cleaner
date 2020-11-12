import React, { Component } from 'react'
import css from './App.css'

import { CSVReader, CSVDownloader } from 'react-papaparse'

export default class App extends Component {
  state = {
    stockData: [],
    optionsData: [],
  }

  handleOnDrop = (data) => {
    const optionsData = []
    const stockData = []
    data.splice(0, 2)
    const remove = ['MISC', 'Journal', 'Dividend', 'Transfer', 'Assignment', 'Receipt', 'Option Expiration', 'Fees', 'Corporate Action']
    data.map( d => {
      let description = d.data[4]?.replace(/ *\([^)]*\) */g, "")
      description = description?.replace(/^[^A-Z]*[^A-Z]/, '')
      const cost = description?.split(" ").slice(-1)[0]
      const amount = d.data[d.data.length -1]
      if ( remove.find( r => r === d.data[1])) return

      if ( d.data[1] === 'Sold' || d.data[1] === 'Bought' ) {
        stockData.push({
          Date: d.data[0]?.split(" ")[0],
          Type: d.data[1],
          Shares: d.data[4]?.split(" ")[0],
          Description: description,
          Cost: cost,
          Amount: amount,
        })
      }
      else {
        optionsData.push({
          Date: d.data[0]?.split(" ")[0],
          Type: d.data[1],
          Shares: d.data[4]?.split(" ")[0],
          Description: description,
          Cost: cost,
          Amount: amount,
        })
      }
    })
    this.setState({ optionsData, stockData })
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleOnRemoveFile = (data) => {
    console.log('---------------------------')
    console.log(data)
    console.log('---------------------------')
  }

  render() {
    const { optionsData, stockData } = this.state

    return (
      <div>
        <div className="file-uploader">
          <CSVReader
            onDrop={this.handleOnDrop}
            onError={this.handleOnError}
            addRemoveButton
            removeButtonColor='#659cef'
            onRemoveFile={this.handleOnRemoveFile}
          >
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
        </div>
        { stockData.length > 0 &&
          <div className="download-buttons">
            <CSVDownloader
              data={ stockData }
              filename={'Stocks'}
              type={'link'}
            >
              Download Stock Data
            </CSVDownloader>

            <CSVDownloader
              data={ optionsData }
              filename={'Options'}
              type={'link'}
            >
              Download Options Data
            </CSVDownloader>
          </div>
        }
      </div>
    )
  }
}
