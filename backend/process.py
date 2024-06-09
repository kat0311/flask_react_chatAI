from langchain_community.document_loaders import SeleniumURLLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.llms import CTransformers
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document
# from urllib.parse import unquote
from langchain_openai import AzureChatOpenAI
from langchain_openai import AzureOpenAI
import os
from dotenv import load_dotenv
load_dotenv()
os.environ["AZURE_OPENAI_API_KEY"] = os.getenv("AZURE_OPENAI_API_KEY")
os.environ["AZURE_OPENAI_ENDPOINT"] = os.getenv("AZURE_OPENAI_ENDPOINT")

#  Generate a Summary of the Text
def split_text_chunks_and_summary_generator(url):
    llm = AzureChatOpenAI(openai_api_version="2023-05-15", 
                        azure_deployment="gpt-4",temperature=0)

    # urls = [
    #     "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    #     "https://goo.gl/maps/NDSHwePEyaHMFGwh8",
    # ]    
    loader=SeleniumURLLoader(urls=[url])
    data=loader.load()
    # print(data)
    text=""
    for page in data:
        text +=page.page_content + " "
    # print(text)
    text_splitter=CharacterTextSplitter(separator='\n',
                                            chunk_size=1000,
                                            chunk_overlap=20)
    text_chunks=text_splitter.split_text(text)
    print(len(text_chunks))   



    docs = [Document(page_content=t) for t in text_chunks]
    chain = load_summarize_chain(llm, chain_type="stuff")
    print(chain.get_prompts)
    summary = chain.invoke(docs)
    print(summary["output_text"])
    return summary["output_text"]
