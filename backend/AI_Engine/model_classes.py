from torch import nn
from transformers import RobertaModel  # if needed elsewhere

class RobertaMultiTaskClassifier(nn.Module):
    def __init__(self, roberta_model, n_sentiment_classes, n_sarcasm_classes):
        super(RobertaMultiTaskClassifier, self).__init__()
        self.roberta = roberta_model
        self.dropout = nn.Dropout(0.3) 
        self.sentiment_classifier = nn.Linear(self.roberta.config.hidden_size, n_sentiment_classes)
        self.sarcasm_classifier = nn.Linear(self.roberta.config.hidden_size, n_sarcasm_classes)

    def forward(self, input_ids, attention_mask):
        outputs = self.roberta(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        pooled_output = outputs.last_hidden_state[:, 0, :]
        pooled_output = self.dropout(pooled_output)
        sentiment_logits = self.sentiment_classifier(pooled_output)
        sarcasm_logits = self.sarcasm_classifier(pooled_output)
        return sentiment_logits, sarcasm_logits
